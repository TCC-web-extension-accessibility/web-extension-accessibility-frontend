import { getClientApi } from '../../../lib/api-client';
import type { VoiceCommandRequest } from '@web-extension-accessibility-frontend/api-client';
import type { VoiceCommand, VoiceNavigationApiError } from '../types/voice-navigation.types';

export class VoiceNavigationApiService {
  private apiClient = getClientApi();

  // Processes a voice command through the API
  async processCommand(request: VoiceCommandRequest): Promise<VoiceCommand | null> {
    try {
      const response = await this.apiClient.Default.Api.processVoiceCommandApiV1VoiceNavigationCommandPost(request);
      return response.data as VoiceCommand;
    } catch (error) {
      const apiError: VoiceNavigationApiError = {
        message: 'Erro ao processar comando no servidor'
      };

      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        if (axiosError.response) {
          apiError.status = axiosError.response.status;
          apiError.message = `Erro ${axiosError.response.status}: ${axiosError.response.statusText}`;
        } else if (axiosError.request) {
          apiError.message = 'Erro de conectividade com o servidor';
          apiError.code = 'NETWORK_ERROR';
        }
      }

      throw apiError;
    }
  }
}
