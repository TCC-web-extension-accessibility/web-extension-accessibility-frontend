'use client';

import { EyeIcon, GoogleLogoIcon } from '@phosphor-icons/react';
import { Button, TextInput } from '@web-extension-accessibility-frontend/ui';
import Link from 'next/link';
import { useForm } from 'react-hook-form';

type CompleteRegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
  completeRegistrationCode: string;
};

type CompleteRegisterPageProps = {
  email: string;
  completeRegistrationCode: string;
};

export function CompleteRegisterPage({
  email,
  completeRegistrationCode,
}: CompleteRegisterPageProps) {
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<CompleteRegisterForm>({
    defaultValues: {
      email: email,
      completeRegistrationCode: completeRegistrationCode,
    },
  });

  function onSubmit(data: CompleteRegisterForm) {
    console.log(data);
  }

  return (
    <div className="flex h-screen">
      <div className="lg:w-[474px] w-full flex flex-col lg:pl-12 p-8 lg:pr-0 items-center justify-center gap-8">
        <form
          className="flex flex-col gap-6 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h1 className="text-5xl font-bold">Conclua seu cadastro</h1>
          <TextInput
            label="E-mail"
            placeholder="usuario@email.com"
            register={register('email', { required: 'E-mail é obrigatório!' })}
            error={errors.email?.message}
            disabled
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
          <TextInput
            icon={<EyeIcon />}
            iconPosition="after"
            label="Confirmar senha"
            type="password"
            placeholder="Digite novamente sua senha..."
            error={errors.confirmPassword?.message}
            register={register('confirmPassword', {
              required: 'Confirmar senha é obrigatório',
              validate: (val: string) => {
                if (getValues('password') !== val) {
                  return 'As senhas não coincidem';
                }
              },
            })}
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
