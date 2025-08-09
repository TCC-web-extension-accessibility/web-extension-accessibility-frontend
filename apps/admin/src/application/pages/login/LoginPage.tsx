'use client';

import { EyeIcon, GoogleLogoIcon } from '@phosphor-icons/react';
import { Button, TextInput } from '@web-extension-accessibility-frontend/ui';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type LoginForm = {
  email: string;
  password: string;
};

export function LoginPage() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<LoginForm>();

  function onSubmit(data: LoginForm) {
    console.log(data);
  }

  return (
    <div className="flex h-screen">
      <div className="lg:w-[474px] w-full flex flex-col lg:pl-12 p-8 lg:pr-0 items-center justify-center gap-8">
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-5xl font-bold">Entre na sua conta</h1>
          <TextInput
            label="E-mail"
            placeholder="usuario@email.com"
            error={errors.email?.message}
            register={register('email', { required: 'E-mail é obrigatório' })}
          />
          <TextInput
            icon={<EyeIcon />}
            iconPosition="after"
            label="Senha"
            type="password"
            placeholder="Digite sua senha..."
            error={errors.password?.message}
            register={register('password', { required: 'Senha é obrigatória' })}
          />
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
        <Link href="/forgot-password" className="underline w-full">
          Esqueceu a senha?
        </Link>
        <div className="border-t border-gray-300 mx-5 w-2/3" />
        <Button
          color="grey-600"
          className="w-full"
          icon={<GoogleLogoIcon size={20} />}
        >
          Entre com sua conta Google
        </Button>
        <p>
          Não possui registro?{' '}
          <Link href="/register" className="underline">
            Clique aqui
          </Link>
        </p>
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
