'use client';

import { CheckCircleIcon } from '@phosphor-icons/react';
import { Button, TextInput } from '@web-extension-accessibility-frontend/ui';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type ForgotPasswordForm = {
  email: string;
};

type ForgotPasswordFormProps = {
  onSubmit: (data: ForgotPasswordForm) => void;
};

function CodeSent() {
  const { push } = useRouter();

  return (
    <div className="animate-fade-in flex flex-col gap-6 w-full">
      <h1 className="text-5xl font-bold flex gap-1 w-full">
        <CheckCircleIcon className="text-success" />
        Código enviado
      </h1>
      <p>
        Enviamos um e-mail para a conta informada, por favor, verifique sua
        caixa de entrada.
      </p>
      <Button
        className="w-full"
        type="button"
        color="grey-600"
        onClick={() => push('/login')}
      >
        Voltar
      </Button>
    </div>
  );
}

function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const { push } = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>();

  return (
    <form
      className="flex flex-col gap-6 w-full"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="text-5xl font-bold">Esqueceu sua senha?</h1>
      <p>Enviaremos um email com um link para confirmar a alteração de senha</p>
      <TextInput
        label="E-mail"
        placeholder="usuario@email.com"
        register={register('email', { required: 'E-mail é obrigatório' })}
        error={errors.email?.message}
      />
      <Button type="submit" className="w-full">
        Enviar código
      </Button>
      <Button type="button" color="grey-600" onClick={() => push('/login')}>
        Voltar
      </Button>
    </form>
  );
}

export function ForgotPasswordPage() {
  const [isCodeSent, setIsCodeSent] = useState(false);

  function onSubmit(data: ForgotPasswordForm) {
    console.log(data);
    setIsCodeSent(true);
  }

  return (
    <div className="flex h-screen">
      <div className="lg:w-[474px] w-full flex flex-col lg:pl-12 p-8 lg:pr-0 items-center justify-center gap-8">
        {isCodeSent ? <CodeSent /> : <ForgotPasswordForm onSubmit={onSubmit} />}
      </div>
      <div className="hidden h-full grow p-12 lg:block">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: "url('/images/login_background.png')" }}
        />
      </div>
    </div>
  );
}
