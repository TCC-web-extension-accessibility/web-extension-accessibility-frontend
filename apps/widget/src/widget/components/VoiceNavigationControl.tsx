import { MicrophoneIcon, MicrophoneSlashIcon, SpeakerHighIcon } from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';
import { useVoiceNavigation } from '../lib/hooks/use-voice-navigation';

export function VoiceNavigationControl() {
  const [state, actions] = useVoiceNavigation();

  const handleToggleListening = async () => {
    if (state.isListening) {
      actions.stopListening();
    } else {
      await actions.startListening();
    }
  };

  const getStatusText = () => {
    switch (state.status) {
      case 'listening':
        return 'Ouvindo...';
      case 'processing':
        return 'Processando...';
      case 'error':
        return 'Erro';
      default:
        return 'Navegação por voz';
    }
  };

  const getStatusColor = () => {
    switch (state.status) {
      case 'listening':
        return 'text-blue-600';
      case 'processing':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getButtonIcon = () => {
    if (state.isListening) {
      return <MicrophoneSlashIcon size={20} />;
    }
    return <MicrophoneIcon size={20} />;
  };

  const getButtonVariant = () => {
    if (state.isListening) {
      return 'simple';
    }
    if (state.error) {
      return 'default';
    }
    return 'default';
  };

  return (
    <div className="space-y-3">
      {/* Status e Controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SpeakerHighIcon size={20} className="text-blue-600" />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {state.isConnected && (
            <div className="w-2 h-2 bg-green-500 rounded-full" title="Conectado ao servidor" />
          )}

          <Button
            size="small"
            variant={getButtonVariant()}
            onClick={handleToggleListening}
            disabled={!state.isSupported && !state.isConnected}
            icon={getButtonIcon()}
          >
            {state.isListening ? 'Parar' : 'Ativar'}
          </Button>
        </div>
      </div>

      {/* Mensagens de Status */}
      {state.lastTranscription && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Comando:</strong> {state.lastTranscription}
          </p>
        </div>
      )}

      {state.lastCommand && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-800">
            <strong>Ação:</strong> {state.lastCommand.action}
            {state.lastCommand.target && (
              <span> → {state.lastCommand.target}</span>
            )}
          </p>
          <p className="text-xs text-green-600 mt-1">
            Confiança: {Math.round(state.lastCommand.confidence * 100)}%
          </p>
        </div>
      )}

      {state.error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Erro:</strong> {state.error}
          </p>
        </div>
      )}

      {/* Informações de Suporte */}
      {!state.isSupported && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Web Speech API não suportada.</strong>
            Usando fallback via servidor.
          </p>
        </div>
      )}

      {/* Comandos de Ajuda */}
      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <p className="text-sm font-medium text-gray-800 mb-2">
          Comandos de voz disponíveis:
        </p>
        <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
          <div><strong>Navegação:</strong> "ir para [elemento]", "rolar para baixo"</div>
          <div><strong>Interação:</strong> "clicar em [elemento]", "botão [nome]"</div>
          <div><strong>Leitura:</strong> "ler [elemento]", "ler página"</div>
          <div><strong>Sistema:</strong> "ajuda", "voltar", "aumentar zoom"</div>
        </div>
      </div>

      {/* Botão de Reset */}
      <div className="flex justify-end">
        <Button
          size="small"
          variant={state.status === 'idle' ? "default" : "simple"}
          onClick={actions.reset}
          disabled={state.status === 'idle' && !state.error}
        >
          Resetar
        </Button>
      </div>
    </div>
  );
}
