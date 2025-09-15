import {
  MicrophoneIcon,
  MicrophoneSlashIcon,
  SpeakerHighIcon,
  CloudIcon,
  CloudSlashIcon,
} from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';
import { useVoiceNavigation } from '../lib/hooks/use-voice-navigation';
import { useEffect, useState } from 'react';

type VoiceNavigationControlProps = {
  selectedLanguage: string | 'en';
};

export function VoiceNavigationControl({
  selectedLanguage,
}: VoiceNavigationControlProps) {
  const [state, actions] = useVoiceNavigation({ selectedLanguage });
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsSpeaking(true);
    const handleEnd = () => setIsSpeaking(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.addEventListener('voiceschanged', handleEnd);
      window.speechSynthesis.addEventListener('start', handleStart);
      window.speechSynthesis.addEventListener('end', handleEnd);
    }

    const interval = setInterval(() => {
      setIsSpeaking(window.speechSynthesis.speaking);
    }, 300);
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleEnd);
        window.speechSynthesis.removeEventListener('start', handleStart);
        window.speechSynthesis.removeEventListener('end', handleEnd);
      }
      clearInterval(interval);
    };
  }, []);

  const handleStopVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

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
        return 'Clique no botão Ativar';
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

  const getConnectionIcon = () => {
    if (state.isConnected) {
      return (
        <span title="Conectado ao servidor">
          <CloudIcon size={16} className="text-green-600" />
        </span>
      );
    }
    return (
      <span title="Desconectado do servidor">
        <CloudSlashIcon size={16} className="text-red-600" />
      </span>
    );
  };

  const getVoiceCommandStatus = () => {
    if (
      state.lastCommand?.intent === 'unknown' ||
      state.lastCommand?.action === 'unknown'
    ) {
      return true;
    }

    if (state.lastCommand?.intent || state.lastCommand?.action) {
      return false;
    }
    console.log("state.lastCommand?.intent", state.lastCommand?.intent);
    console.log("state.lastCommand?.action", state.lastCommand?.action);
    console.log("state.lastCommand?.target", state.lastCommand?.target);

    return state.lastCommand?.target === null;
  };

  const buttonResetDisabled = () =>
    state.status === 'idle' && !state.error && !getVoiceCommandStatus();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SpeakerHighIcon size={20} className="text-blue-600" />
          <span className={`text-sm font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {getConnectionIcon()}

          <Button
            size="small"
            variant={getButtonVariant()}
            onClick={handleToggleListening}
            disabled={!state.isSupported && !state.isConnected || state.status === 'processing'}
            icon={getButtonIcon()}
          >
            {state.isListening ? 'Parar' : 'Ativar'}
          </Button>
        </div>
      </div>

      {state.lastTranscription && !state.error && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Comando:</strong> {state.lastTranscription}
          </p>
        </div>
      )}

      {state.lastCommand && !getVoiceCommandStatus() && !state.error && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-green-800">
              <strong>Processado via API:</strong> {state.lastCommand.action}
              {state.lastCommand.target && (
                <span> → {state.lastCommand.target}</span>
              )}
            </p>
            <CloudIcon size={16} className="text-green-600" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-green-600">
              Intent: {state.lastCommand.intent}
            </span>
            <span className="text-green-600">
              Confiança: {Math.round(state.lastCommand.confidence * 100)}%
            </span>
          </div>
        </div>
      )}

      {(state.error || getVoiceCommandStatus()) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Erro:</strong> {state.error || 'Comando não reconhecido'}
          </p>
        </div>
      )}

      {!state.isSupported && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Web Speech API não suportada.</strong>
          </p>
        </div>
      )}

      <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <p className="text-sm font-medium text-gray-800">
            Comandos de voz disponíveis:
          </p>
          <CloudIcon size={16} className="text-gray-600" />
        </div>
        <div className="grid grid-cols-1 gap-1 text-xs text-gray-600">
          <div>
            <strong>Navegação:</strong> "próximo elemento", "elemento anterior",
            "rolar para baixo"
          </div>
          <div>
            <strong>Interação:</strong> "clicar em [elemento]", "botão [nome]"
          </div>
          <div>
            <strong>Leitura:</strong> "ler [elemento]", "ler página"
          </div>
          <div>
            <strong>Sistema:</strong> "ajuda", "voltar", "aumentar zoom",
            "diminuir zoom"
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        {isSpeaking && (
          <button
            className="flex items-center px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 cursor-pointer"
            onClick={handleStopVoice}
            aria-label="Parar voz de feedback"
            type="button"
          >
            Parar voz
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <Button
            size="small"
            variant={buttonResetDisabled() ? 'default' : 'simple'}
            onClick={actions.reset}
            disabled={buttonResetDisabled()}
          >
            Resetar
          </Button>
        </div>
      </div>
    </div>
  );
}
