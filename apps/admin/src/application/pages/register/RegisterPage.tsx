'use client';

import { CheckCircleIcon, GoogleLogoIcon } from '@phosphor-icons/react';
import { Button, TextInput } from '@web-extension-accessibility-frontend/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type RegisterForm = {
  email: string;
};

function EmailSent() {
  const { push } = useRouter();

  return (
    <div className="animate-fade-in flex flex-col gap-6 w-full">
      <h1 className="text-5xl font-bold flex gap-1 w-full">
        <CheckCircleIcon className="text-success" />
        E-mail enviado
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

function RegisterForm({
  onSubmit,
}: {
  onSubmit: (data: RegisterForm) => void;
}) {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<RegisterForm>();

  return (
    <>
      <form
        className="flex flex-col gap-6 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h1 className="text-5xl font-bold">Crie uma nova conta</h1>
        <TextInput
          label="E-mail"
          placeholder="usuario@email.com"
          register={register('email', { required: 'E-mail é obrigatório!' })}
          error={errors.email?.message}
        />
        <Button type="submit" className="w-full">
          Cadastrar-se
        </Button>
      </form>
      <div className="border-t border-gray-300 mx-5 w-2/3" />
      <Button
        color="grey-600"
        className="w-full"
        icon={<GoogleLogoIcon size={20} />}
      >
        Cadastre-se com Google
      </Button>
      <p>
        Já possui uma conta?{' '}
        <Link href="/login" className="underline">
          Clique aqui
        </Link>{' '}
        para entrar
      </p>
    </>
  );
}

export function RegisterPage() {
  const [emailSent, setEmailSent] = useState(false);

  function onSubmit(data: RegisterForm) {
    console.log(data);
    setEmailSent(true);
  }

  return (
    <div className="flex h-screen">
      <div className="lg:w-[474px] w-full flex flex-col lg:pl-12 p-8 lg:pr-0 items-center justify-center gap-8">
        {emailSent ? <EmailSent /> : <RegisterForm onSubmit={onSubmit} />}
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
