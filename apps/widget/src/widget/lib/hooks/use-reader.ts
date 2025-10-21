import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { TTSRequest } from '@web-extension-accessibility-frontend/api-client';
import { DomNavigationService } from '../services/dom-navigation.service';
import { getClientApi } from '../../../lib/api-client';

export type ReaderState = {
  isLoading: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  progress: number;
  barVisible: boolean;
  error?: string;
  isEnabled: boolean;
};

export type ReaderActions = {
  readPage: () => Promise<void>;
  stop: () => void;
  pause: () => void;
  resume: () => Promise<void>;
  toggle: () => Promise<void>;
  playPause: () => void;
};

export type UseReaderProps = {
  selectedLanguage?: string;
};

export function useReader(props?: UseReaderProps): {readerState: ReaderState, readerActions: ReaderActions} {
  if (import.meta.env.VITE_FEATURE_READER !== 'true') {
    return {
      readerState: {
        isLoading: false,
        isPlaying: false,
        isPaused: false,
        progress: 0,
        barVisible: false,
        isEnabled: false,
      },
      readerActions: {
        readPage: async () => {},
        stop: () => {},
        pause: () => {},
        resume: async () => {},
        toggle: async () => {},
        playPause: () => {},
      },
    };
  }

  const [state, setState] = useState<ReaderState>({
    isLoading: false,
    isPlaying: false,
    isPaused: false,
    progress: 0,
    barVisible: false,
    isEnabled: true,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  const domService = useMemo(() => new DomNavigationService(), []);
  const api = useMemo(() => getClientApi().Default.Api, []);
  const requestAbortRef = useRef<AbortController | null>(null);

  const cleanupAudio = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    } catch {}

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    audioRef.current = null;
  }, []);

  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  const stop = useCallback(() => {
    // cancelar requisição em andamento (análise)
    if (requestAbortRef.current) {
      try { requestAbortRef.current.abort(); } catch {}
      requestAbortRef.current = null;
    }

    cleanupAudio();
    setState((prev) => ({ ...prev, isPlaying: false, isLoading: false, isPaused: false, progress: 0, barVisible: false }));
  }, [cleanupAudio]);

  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setState((prev) => ({ ...prev, isPlaying: false, isPaused: true }));
    }
  }, []);

  const resume = useCallback(async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setState((prev) => ({ ...prev, isPlaying: true, isPaused: false }));
      } catch (e) {
        console.error('Erro ao retomar áudio:', e);
      }
    }
  }, []);

  const readPage = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: undefined, isPaused: false }));

      const text =
        domService.getPageContent()?.trim() ||
        document.body?.innerText?.trim() ||
        '';

      if (!text) {
        throw new Error('Nenhum conteúdo textual encontrado na página.');
      }

      // interrompe áudio anterior e cancela qualquer requisição anterior
      if (requestAbortRef.current) {
        try { requestAbortRef.current.abort(); } catch {}
        requestAbortRef.current = null;
      }
      cleanupAudio();

      const payload: TTSRequest = {
        text,
        lang: props?.selectedLanguage || 'en',
      };

      // cria um AbortController para permitir cancelar a análise
      const controller = new AbortController();
      requestAbortRef.current = controller;

      // solicita o áudio ao backend (como blob)
      const response: any = await (api as any).convertAudioApiV1ConvertAudioPost(
        payload as any,
        { responseType: 'blob', signal: controller.signal } as any
      );

      // requisição concluída, limpar o controller atual
      requestAbortRef.current = null;

      const blob: Blob = response?.data instanceof Blob
        ? response.data
        : new Blob([response?.data], { type: 'audio/mpeg' });

      const url = URL.createObjectURL(blob);
      objectUrlRef.current = url;

      const audio = new Audio(url);
      audioRef.current = audio;

      audio.addEventListener('ended', () => {
        setState((prev) => ({ ...prev, isPlaying: false, isPaused: false, progress: 0, barVisible: false }));
        cleanupAudio();
      });

      audio.addEventListener('error', () => {
        setState((prev) => ({ ...prev, isPlaying: false, isPaused: false, progress: 0, barVisible: false, error: 'Falha na reprodução do áudio' }));
        cleanupAudio();
      });

      audio.addEventListener('timeupdate', () => {
        if (audio.duration > 0) {
          const progress = (audio.currentTime / audio.duration) * 100;
          setState((prev) => ({ ...prev, progress }));
        }
      });

      await audio.play();
      setState((prev) => ({ ...prev, isPlaying: true, isPaused: false, barVisible: true }));
    } catch (err: any) {
      // se foi cancelado pelo usuário, não tratar como erro
      const canceled = err?.name === 'CanceledError' || err?.code === 'ERR_CANCELED' || err?.message === 'canceled' || err?.name === 'AbortError';
      if (!canceled) {
        console.error('Erro ao ler página:', err);
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          barVisible: false,
          error: err?.message || 'Erro ao gerar áudio',
        }));
      }
      cleanupAudio();
    } finally {
      // garantir que não fique preso em loading
      requestAbortRef.current = null;
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [api, domService, cleanupAudio, props?.selectedLanguage]);

  const toggle = useCallback(async () => {
    if (state.isLoading || state.isPlaying || state.isPaused) {
      stop();
    } else {
      await readPage();
    }
  }, [state.isPlaying, state.isLoading, state.isPaused, readPage, stop]);

  const playPause = useCallback(() => {
    if (state.isPlaying) {
      pause();
    } else if (state.isPaused) {
      resume();
    }
  }, [state.isPlaying, state.isPaused, pause, resume]);

  const actions: ReaderActions = { readPage, stop, pause, resume, toggle, playPause };

  return {readerState: state, readerActions: actions};
}
