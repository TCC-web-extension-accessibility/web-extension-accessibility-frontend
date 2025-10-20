'use client';

import {
  BookOpenIcon,
  CheckCircleIcon,
  EyeIcon,
  GearIcon,
  KeyboardIcon,
  MegaphoneIcon,
  PaletteIcon,
  TextAaIcon,
  WarningCircleIcon,
} from '@phosphor-icons/react';
import { Markdown } from '@web-extension-accessibility-frontend/ui';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Loading from '~/src/app/(dashboard)/loading';

type BestPracticeSection = {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
  filename: string;
  content?: string;
};

type BestPracticesConfig = {
  sections: BestPracticeSection[];
  additionalResources: {
    title: string;
    filename: string;
    content?: string;
  };
};

const iconMap = {
  BookOpenIcon,
  KeyboardIcon,
  PaletteIcon,
  TextAaIcon,
  EyeIcon,
  MegaphoneIcon,
};

export function BestPracticesPage() {
  const [config, setConfig] = useState<BestPracticesConfig | null>(null);
  const [sectionsWithContent, setSectionsWithContent] = useState<
    BestPracticeSection[]
  >([]);
  const [additionalResourcesContent, setAdditionalResourcesContent] =
    useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        setLoading(true);
        setError(null);

        const configResponse = await fetch('/best-practices/sections.json');
        if (!configResponse.ok) {
          throw new Error('Failed to load configuration');
        }
        const config: BestPracticesConfig = await configResponse.json();
        setConfig(config);

        const sectionsWithMarkdown = await Promise.all(
          config.sections.map(async (section) => {
            try {
              const contentResponse = await fetch(
                `/best-practices/${section.filename}`
              );
              if (!contentResponse.ok) {
                console.warn(`Failed to load ${section.filename}`);
                return {
                  ...section,
                  content: `# ${section.title}\n\nConteúdo em desenvolvimento...`,
                };
              }
              const content = await contentResponse.text();
              return { ...section, content };
            } catch (error) {
              console.warn(`Error loading ${section.filename}:`, error);
              return {
                ...section,
                content: `# ${section.title}\n\nConteúdo em desenvolvimento...`,
              };
            }
          })
        );
        setSectionsWithContent(sectionsWithMarkdown);

        try {
          const resourcesResponse = await fetch(
            `/best-practices/${config.additionalResources.filename}`
          );
          if (resourcesResponse.ok) {
            const resourcesContent = await resourcesResponse.text();
            setAdditionalResourcesContent(resourcesContent);
          }
        } catch (error) {
          console.warn('Failed to load additional resources:', error);
          setAdditionalResourcesContent(
            '# Recursos Adicionais\n\nConteúdo em desenvolvimento...'
          );
        }
      } catch (err) {
        setError(
          'Erro ao carregar conteúdo das boas práticas. Tente novamente.'
        );
        console.error('Error loading best practices content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <WarningCircleIcon
            size={48}
            className="text-danger-500 mx-auto mb-4"
          />
          <h2 className="text-xl font-semibold text-foreground mb-2">
            Erro ao Carregar
          </h2>
          <p className="text-grey-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <BookOpenIcon size={32} className="text-primary-500" />
            <h1 className="text-3xl font-bold text-foreground">
              Boas Práticas de Acessibilidade Web
            </h1>
          </div>
          <p className="text-lg text-grey-600 max-w-3xl">
            Guia com boas práticas, dicas e exemplos para criação de conteúdo
            web acessível. Siga estas diretrizes para garantir que seu conteúdo
            seja utilizável por todos os usuários.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg border border-grey-200 p-6">
            <div className="flex items-center gap-3">
              <CheckCircleIcon size={24} className="text-success-500" />
              <div>
                <h3 className="font-semibold text-foreground">WCAG 2.2</h3>
                <p className="text-sm text-grey-600">Diretrizes seguidas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-grey-200 p-6">
            <div className="flex items-center gap-3">
              <WarningCircleIcon size={24} className="text-warn-500" />
              <div>
                <h3 className="font-semibold text-foreground">Criticalidade</h3>
                <p className="text-sm text-grey-600">Práticas priorizadas</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-grey-200 p-6">
            <div className="flex items-center gap-3">
              <GearIcon size={24} className="text-primary-500" />
              <div>
                <h3 className="font-semibold text-foreground">Implementação</h3>
                <p className="text-sm text-grey-600">Exemplos práticos</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {sectionsWithContent.map((section) => (
            <BestPracticeSection key={section.id} section={section} />
          ))}
        </div>

        {additionalResourcesContent && (
          <div className="mt-12 bg-white rounded-lg border border-grey-200 p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">
              {config?.additionalResources.title || 'Recursos Adicionais'}
            </h2>
            <Markdown>{additionalResourcesContent}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
}

function BestPracticeSection({ section }: { section: BestPracticeSection }) {
  const Icon = iconMap[section.icon as keyof typeof iconMap] || BookOpenIcon;

  const colorClasses = {
    primary: 'bg-primary-100 border-primary-200 text-primary-700',
    secondary: 'bg-secondary-100 border-secondary-200 text-secondary-700',
    success: 'bg-success-100 border-success-200 text-success-700',
    warn: 'bg-warn-100 border-warn-200 text-warn-700',
    danger: 'bg-danger-100 border-danger-200 text-danger-700',
    grey: 'bg-grey-100 border-grey-200 text-grey-700',
  };

  return (
    <div className="bg-white rounded-lg border border-grey-200 overflow-hidden">
      <div
        className={clsx(
          'px-6 py-4 border-b border-grey-200',
          colorClasses[section.color as keyof typeof colorClasses]
        )}
      >
        <div className="flex items-center gap-3">
          <Icon size={28} />
          <div>
            <h2 className="text-xl font-bold">{section.title}</h2>
            {section.description && (
              <p className="text-sm opacity-90 mt-1">{section.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {section.content && <Markdown>{section.content}</Markdown>}
      </div>
    </div>
  );
}
