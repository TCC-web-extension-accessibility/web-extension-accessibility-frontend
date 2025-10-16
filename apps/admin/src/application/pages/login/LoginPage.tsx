'use client';

import { EyeIcon, GoogleLogoIcon } from '@phosphor-icons/react';
import { useMutation } from '@tanstack/react-query';
import { Button, TextInput } from '@web-extension-accessibility-frontend/ui';
import { AxiosError } from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { getClientApi } from '../../../lib/api-client';
import { authService } from '../../../lib/auth';

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
  const router = useRouter();

  const { mutate: login, isPending } = useMutation({
    mutationFn: async (data: LoginForm) => {
      const api = getClientApi();
      const response =
        await api.Default.Admin.loginForAccessTokenAdminLoginPost(
          data.email,
          data.password
        );
      return response.data;
    },
    onSuccess: (data) => {
      if (data?.access_token) {
        authService.setToken(data.access_token);
        toast.success('Login realizado com sucesso!');
        router.push('/home');
      }
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      console.error('Login error:', error);
      const errorMessage =
        error.response?.data?.detail ||
        'Credenciais inválidas. Tente novamente.';
      toast.error(errorMessage);
    },
  });

  function onSubmit(data: LoginForm) {
    login(data);
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
            disabled={isPending}
          />
          <TextInput
            icon={<EyeIcon />}
            iconPosition="after"
            label="Senha"
            type="password"
            placeholder="Digite sua senha..."
            error={errors.password?.message}
            register={register('password', { required: 'Senha é obrigatória' })}
            disabled={isPending}
          />
          <Button type="submit" className="w-full" loading={isPending}>
            Entrar
          </Button>
        </form>
        <Link href="/esqueci-minha-senha" className="underline w-full">
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
          <Link href="/cadastro" className="underline">
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
