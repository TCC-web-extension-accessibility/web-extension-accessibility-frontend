import { PauseCircleIcon, PlayCircleIcon, StopCircleIcon } from '@phosphor-icons/react';
import { Button } from '@web-extension-accessibility-frontend/ui';

type AudioProgressBarProps = {
  isPlaying: boolean;
  progress: number;
  onPlayPause: () => void;
  onStop: () => void;
};

export function AudioProgressBar({
  isPlaying,
  progress,
  onPlayPause,
  onStop,
}: AudioProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto rounded-lg bottom-0 left-0 right-0 bg-white border-2 border-gray-300 p-4">
      <div className="flex items-center gap-4 max-w-4xl mx-auto">
        {/* Botões de controle */}
        <div className="flex gap-2">
          <Button
            className="p-3 rounded-full"
            aria-label={isPlaying ? 'Pausar áudio' : 'Retomar áudio'}
            variant="simple"
            icon={
              isPlaying ? (
                <PauseCircleIcon size={25} weight="fill" />
              ) : (
                <PlayCircleIcon size={25} weight="fill" />
              )
            }
            onClick={onPlayPause}
          />
          <Button
            className="p-3 rounded-full"
            aria-label="Parar áudio"
            variant="simple"
            icon={<StopCircleIcon size={25} weight="fill" />}
            onClick={onStop}
          />
        </div>

        {/* Barra de progresso */}
        <div className="flex-1">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
