'use client';

import { EyeIcon } from '@phosphor-icons/react';
import { Button, TextInput } from '@web-extension-accessibility-frontend/ui';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type CompleteRegisterForm = {
  email: string;
  password: string;
  confirmPassword: string;
  forgotPasswordCode: string;
};

type ResetPasswordPageProps = {
  email: string;
  forgotPasswordCode: string;
};

export function ResetPasswordPage({
  email,
  forgotPasswordCode,
}: ResetPasswordPageProps) {
  const { push } = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
  } = useForm<CompleteRegisterForm>({
    defaultValues: {
      email: email,
      forgotPasswordCode: forgotPasswordCode,
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
          <h1 className="text-5xl font-bold">Redefina sua senha</h1>
          <input
            type="hidden"
            {...register('email', { required: 'E-mail é obrigatório!' })}
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
              validate: (value: string) => {
                if (getValues('password') !== value) {
                  return 'As senhas não coincidem';
                }
              },
            })}
          />
          <Button type="submit" className="w-full">
            Redefinir senha
          </Button>
        </form>
        <Button
          color="grey-600"
          className="w-full"
          onClick={() => push('/login')}
        >
          Voltar
        </Button>
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
