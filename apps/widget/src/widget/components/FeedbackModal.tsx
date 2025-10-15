import { XIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { Button, TextInput } from '@web-extension-accessibility-frontend/ui';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getClientApi } from '../../lib/api-client';

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FeedbackFormData = {
  title: string;
  message: string;
};

export function FeedbackModal({ isOpen, onClose }: FeedbackModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<FeedbackFormData>({
    defaultValues: {
      title: '',
      message: '',
    },
  });

  const { mutate: sendFeedback, isPending } = useMutation({
    mutationFn: async (feedback: FeedbackFormData) => {
      const api = getClientApi();
      console.log('API Client:', api);
      // Using a test endpoint since feedback endpoint doesn't exist yet
      // TODO: Fazer endpoint de feedback --- IGNORE ---
      //await api.Default.Auth.readUsersMeAuthUsersMeGet();

      // Log the feedback data for testing
      console.log('Feedback submitted:', feedback);
      return 'success';
    },
    onSuccess: () => {
      toast.success('Feedback enviado com sucesso!');
      reset();
      onClose();
    },
    onError: () => {
      toast.error('Erro ao enviar feedback!');
      handleClose();
    },
  });

  const onSubmit = (data: FeedbackFormData) => {
    sendFeedback(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  const modalClasses = `
    fixed bottom-0 right-0 w-full md:w-[600px] h-screen bg-black/60 flex items-center justify-center z-[60]
  `;

  const contentClasses = `
    bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[80vh] overflow-y-auto
    transform transition-all duration-300 ease-in-out
    ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
  `;

  return (
    <div className={modalClasses} onClick={handleClose}>
      <div className={contentClasses} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Enviar Feedback</h2>
          <Button
            className="p-2 rounded-full text-xl"
            variant="simple"
            onClick={handleClose}
            icon={<XIcon />}
          />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <TextInput
            label="Título"
            placeholder="Digite o título do feedback"
            register={register('title', {
              required: 'Título é obrigatório',
              minLength: {
                value: 3,
                message: 'Título deve ter pelo menos 3 caracteres',
              },
            })}
            error={errors.title?.message}
          />

          <div className="flex flex-col gap-2">
            <label className="font-lato text-base font-normal text-foreground leading-[1.1875]">
              Mensagem
            </label>
            <textarea
              {...register('message', {
                required: 'Mensagem é obrigatória',
                minLength: {
                  value: 10,
                  message: 'Mensagem deve ter pelo menos 10 caracteres',
                },
              })}
              className={`w-full min-h-[120px] p-3 border rounded-lg resize-vertical
                        focus:ring-2 focus:outline-none
                        placeholder-grey-500 text-foreground
                        ${
                          errors.message
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50'
                            : 'border-grey-500 focus:border-foreground focus:ring-foreground/50'
                        }`}
              placeholder="Digite sua mensagem de feedback"
            />
            {errors.message && (
              <span className="text-sm text-red-500">
                {errors.message.message}
              </span>
            )}
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="simple"
              onClick={handleClose}
              loading={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!isValid} loading={isPending}>
              Enviar Feedback
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
