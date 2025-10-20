'use client';

import { WarningCircleIcon } from '@phosphor-icons/react';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  DeploymentStatusResponse,
  WidgetConfigAdminResponse,
  WidgetConfigJson,
} from '@web-extension-accessibility-frontend/api-client';
import { Button, Switch } from '@web-extension-accessibility-frontend/ui';
import { useCallback, useEffect, useRef } from 'react';
import { Controller, useForm, type Control } from 'react-hook-form';
import { toast } from 'react-toastify';
import Loading from '~/src/app/(dashboard)/loading';
import { getClientApi } from '../../../lib/api-client';
import { DeploymentStatusBanner } from './DeploymentStatusBanner';

const WIDGET_CONTROL_LABELS: Record<string, string> = {
  contrast: 'Contraste',
  reader: 'Leitor de tela',
  font_size: 'Tamanho da fonte',
  font_family: 'Estilo de fonte',
  line_height: 'Altura da linha',
  letter_spacing: 'Espaçamento das letras',
  disable_animations: 'Pausar animações',
  hide_images: 'Ocultar imagens',
  reading_guide: 'Guia de leitura',
  voice_navigation: 'Navegação por voz',
  highlight_links: 'Destacar links',
  saturation: 'Saturação',
  color_filter: 'Filtro de cores',
} as const;

const WIDGET_CONTROL_DESCRIPTIONS: Record<string, string> = {
  contrast:
    'Permite ajustar o contraste da página para melhorar a legibilidade',
  reader: 'Ativa o leitor de tela para narrar o conteúdo da página',
  font_size: 'Permite aumentar ou diminuir o tamanho do texto',
  font_family:
    'Permite trocar a fonte para opções mais legíveis, incluindo fonte para dislexia',
  line_height: 'Ajusta o espaçamento entre linhas para facilitar a leitura',
  letter_spacing:
    'Ajusta o espaçamento entre letras para melhorar a clareza do texto',
  disable_animations:
    'Desativa animações e transições para reduzir distrações e prevenir desconforto',
  hide_images:
    'Oculta todas as imagens da página para reduzir distrações visuais',
  reading_guide:
    'Exibe uma régua de leitura para ajudar a acompanhar o texto linha por linha',
  voice_navigation:
    'Permite navegar e controlar a página usando comandos de voz',
  highlight_links:
    'Destaca todos os links na página para facilitar a identificação',
  saturation: 'Ajusta a saturação de cores para reduzir o cansaço visual',
  color_filter: 'Aplica filtros de cor',
} as const;

const formatLabel = (key: string): string => {
  return (
    WIDGET_CONTROL_LABELS[key] ||
    key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

const getDescription = (key: string): string => {
  return WIDGET_CONTROL_DESCRIPTIONS[key] || '';
};

export function WidgetConfigPage() {
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const {
    data: configData,
    isLoading: isLoadingConfig,
    isError: isErrorConfig,
    error: configError,
    refetch: refetchConfig,
  } = useQuery<WidgetConfigAdminResponse>({
    queryKey: ['widgetConfig'],
    queryFn: async () => {
      const api = getClientApi();
      const response = await api.Default.Admin.getConfigAdminConfigGet();
      return response.data;
    },
    refetchOnMount: true,
  });

  const { data: deploymentStatus, refetch: refetchDeployment } =
    useQuery<DeploymentStatusResponse>({
      queryKey: ['deploymentStatus'],
      queryFn: async () => {
        const api = getClientApi();
        const response =
          await api.Default.Admin.getDeploymentStatusAdminDeploymentStatusGet();
        return response.data;
      },
      refetchInterval: (query) => {
        const data = query.state.data;
        if (data?.status === 'in_progress' || data?.status === 'queued') {
          return 10000;
        }
        return false;
      },
    });

  console.log(deploymentStatus);

  const {
    handleSubmit,
    reset,
    watch,
    control,
    formState: { isDirty },
  } = useForm<WidgetConfigJson>({
    defaultValues: configData?.config,
  });

  useEffect(() => {
    if (configData?.config) {
      reset(configData.config);
    }
  }, [configData, reset]);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }
    };
  }, []);

  const updateConfigMutation = useMutation({
    mutationFn: async (config: WidgetConfigJson) => {
      const api = getClientApi();
      const response = await api.Default.Admin.updateConfigAdminConfigPut(
        config
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success('Configuração salva! Implantação iniciada...');
      reset(undefined, { keepValues: true });
      refetchConfig();
      refetchDeployment();

      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
      if (pollTimeoutRef.current) {
        clearTimeout(pollTimeoutRef.current);
      }

      pollIntervalRef.current = setInterval(() => {
        refetchDeployment();
      }, 10000);

      pollTimeoutRef.current = setTimeout(() => {
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }, 300000);
    },
    onError: (error: any) => {
      toast.error(
        error?.response?.data?.detail || 'Erro ao salvar configuração'
      );
    },
  });

  const onSubmit = useCallback(
    (data: WidgetConfigJson) => {
      updateConfigMutation.mutate(data);
    },
    [updateConfigMutation]
  );

  const handleReset = useCallback(() => {
    if (configData?.config) {
      reset(configData.config);
    }
  }, [configData?.config, reset]);

  if (isLoadingConfig) {
    return <Loading />;
  }

  if (isErrorConfig) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-2">
          <WarningCircleIcon size={24} className="text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">
            Erro ao carregar configuração
          </h3>
        </div>
        <p className="text-red-700 mb-4">
          {configError instanceof Error
            ? configError.message
            : 'Não foi possível carregar as configurações do widget.'}
        </p>
        <Button onClick={() => refetchConfig()} color="danger-500">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const formValues = watch();

  if (!formValues?.features) {
    return null;
  }

  const widgetControls = formValues.features.widget_controls;
  const controlEntries = Object.entries(widgetControls);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div>
        <h1 className="text-3xl font-bold mb-2">Configuração do Widget</h1>
        <p className="text-gray-600">
          Gerencie as funcionalidades e controles do widget de acessibilidade
        </p>
      </div>

      {deploymentStatus && <DeploymentStatusBanner status={deploymentStatus} />}

      <FeatureToggle
        label="Seletor de Idiomas"
        description="Permite aos usuários alternar entre diferentes idiomas"
        control={control}
        fieldPath="features.language_selector.enabled"
      />
      <FeatureToggle
        label="Perfis de Acessibilidade"
        description="Perfis pré-configurados para diferentes necessidades (daltonismo, baixa visão, TDAH, epilepsia)"
        control={control}
        fieldPath="features.accessibility_profiles.enabled"
      />

      <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Controles do Widget</h2>
        <div className="grid grid-cols-2 gap-2">
          {controlEntries.map(([key]) => (
            <FeatureToggle
              key={key}
              label={formatLabel(key)}
              description={getDescription(key)}
              control={control}
              fieldPath={`features.widget_controls.${key}.enabled`}
            />
          ))}
        </div>
      </section>

      <div className="flex items-center gap-2 justify-end">
        <Button
          type="button"
          onClick={handleReset}
          disabled={!isDirty || updateConfigMutation.isPending}
          variant="outline"
          color="grey-600"
        >
          Descartar
        </Button>
        <Button
          type="submit"
          disabled={!isDirty || updateConfigMutation.isPending}
          color="primary"
          loading={updateConfigMutation.isPending}
        >
          {updateConfigMutation.isPending
            ? 'Salvando...'
            : 'Salvar e Implantar'}
        </Button>
      </div>
    </form>
  );
}

type FeatureToggleProps = {
  label: string;
  description?: string;
  control: Control<WidgetConfigJson>;
  fieldPath: string;
};

function FeatureToggle({
  label,
  description,
  control,
  fieldPath,
}: FeatureToggleProps) {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
      <div className="flex-1">
        <span className="font-medium text-gray-900 block">{label}</span>
        {description && (
          <span className="text-sm text-gray-500 mt-1 block">
            {description}
          </span>
        )}
      </div>
      <Controller
        control={control}
        name={fieldPath as any}
        render={({ field }) => (
          <Switch
            checked={Boolean(field.value)}
            onCheckedChange={field.onChange}
            className="ml-4"
          />
        )}
      />
    </div>
  );
}
