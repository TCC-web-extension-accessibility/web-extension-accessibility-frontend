import {
  CloudIcon,
  CloudSlashIcon,
  MicrophoneIcon,
  MicrophoneSlashIcon,
  SpeakerHighIcon,
  TranslateIcon,
} from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';
import { useEffect, useState } from 'react';
import { useVoiceNavigation } from '../lib/hooks/use-voice-navigation';

type VoiceNavigationControlProps = {
  selectedLanguage: string | 'en';
  nameOfTheSelectedLanguage: string;
};

export function VoiceNavigationControl({
  selectedLanguage,
  nameOfTheSelectedLanguage,
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
        return 'text-primary-600';
      case 'processing':
        return 'text-warn';
      case 'error':
        return 'text-danger';
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
          <CloudIcon size={16} className="text-success" />
        </span>
      );
    }
    return (
      <span title="Desconectado do servidor">
        <CloudSlashIcon size={16} className="text-danger" />
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

    return state.lastCommand?.target === null;
  };

  const buttonResetDisabled = () =>
    state.status === 'idle' && !state.error && !getVoiceCommandStatus();

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1.5">
        <TranslateIcon size={20} className="text-orange-600" />
        <p className="text-xs text-orange-800">Voz:</p>
        <p className="py-1 px-3 bg-orange-100 border border-orange-200 text-xs text-orange-800 rounded-lg">
          {nameOfTheSelectedLanguage}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <SpeakerHighIcon size={20} className="text-primary" />
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
            disabled={
              (!state.isSupported && !state.isConnected) ||
              state.status === 'processing'
            }
            icon={getButtonIcon()}
          >
            {state.isListening ? 'Parar' : 'Ativar'}
          </Button>
        </div>
      </div>

      {state.lastTranscription && !state.error && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-primary">
            <strong>Comando:</strong> {state.lastTranscription}
          </p>
        </div>
      )}

      {state.lastCommand && !getVoiceCommandStatus() && !state.error && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-success">
              <strong>Processado via API:</strong> {state.lastCommand.action}
              {state.lastCommand.target && (
                <span> → {state.lastCommand.target}</span>
              )}
            </p>
            <CloudIcon size={16} className="text-success" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-success">
              Intent: {state.lastCommand.intent}
            </span>
            <span className="text-success">
              Confiança: {Math.round(state.lastCommand.confidence * 100)}%
            </span>
          </div>
        </div>
      )}

      {(state.error || getVoiceCommandStatus()) && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-danger">
            <strong>Erro:</strong> {state.error || 'Comando não reconhecido'}
          </p>
        </div>
      )}

      {!state.isSupported && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-warn">
            <strong>Web Speech API não suportada.</strong>
          </p>
        </div>
      )}

      <div className="hidden lg:block p-3 bg-gray-50 border border-gray-200 rounded-lg">
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
          <Button
            size="small"
            variant="default"
            color="danger-500"
            onClick={handleStopVoice}
            aria-label="Parar voz de feedback"
          >
            Parar voz
          </Button>
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
