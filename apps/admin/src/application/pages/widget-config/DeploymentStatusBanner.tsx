import { CheckCircleIcon } from '@phosphor-icons/react/dist/icons/CheckCircle';
import { SpinnerGapIcon } from '@phosphor-icons/react/dist/icons/SpinnerGap';
import { WarningCircleIcon } from '@phosphor-icons/react/dist/icons/WarningCircle';
import { DeploymentStatusResponse } from '@web-extension-accessibility-frontend/api-client';

type DeploymentStatusBannerProps = {
  status: DeploymentStatusResponse;
};

export function DeploymentStatusBanner({
  status,
}: DeploymentStatusBannerProps) {
  const isInProgress =
    status.status === 'in_progress' || status.status === 'queued';
  const isSuccess = status.conclusion === 'success';
  const isFailed = status.conclusion === 'failure';

  if (status.status === 'unknown') {
    return null;
  }

  return (
    <div
      className={`rounded-lg p-4 border ${
        isInProgress
          ? 'bg-warn-50 border-warn-300'
          : isSuccess
          ? 'bg-success-50 border-success-200'
          : isFailed
          ? 'bg-danger-50 border-danger-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center gap-3">
        {isInProgress ? (
          <SpinnerGapIcon size={24} className="text-warn-600 animate-spin" />
        ) : isSuccess ? (
          <CheckCircleIcon
            size={24}
            className="text-success-600"
            weight="fill"
          />
        ) : isFailed ? (
          <WarningCircleIcon
            size={24}
            className="text-danger-600"
            weight="fill"
          />
        ) : null}

        <div className="flex-1">
          <p
            className={`font-medium ${
              isInProgress
                ? 'text-warn-900'
                : isSuccess
                ? 'text-success-900'
                : isFailed
                ? 'text-danger-900'
                : 'text-gray-900'
            }`}
          >
            {isInProgress
              ? 'Implantação em andamento...'
              : isSuccess
              ? 'Implantação concluída com sucesso!'
              : isFailed
              ? 'Falha na implantação'
              : 'Status da implantação'}
          </p>
          {status.updated_at && (
            <p className="text-sm text-gray-600 mt-1">
              Última atualização:{' '}
              {new Date(status.updated_at).toLocaleString('pt-BR')}
            </p>
          )}
        </div>

        {status.url && (
          <a
            href={status.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-sm font-medium underline ${
              isInProgress
                ? 'text-warn-700 hover:text-warn-800'
                : isSuccess
                ? 'text-success-700 hover:text-success-800'
                : isFailed
                ? 'text-danger-700 hover:text-danger-800'
                : 'text-gray-700 hover:text-gray-800'
            }`}
          >
            Ver no GitHub
          </a>
        )}
      </div>
    </div>
  );
}
