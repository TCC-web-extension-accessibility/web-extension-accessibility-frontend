import { CompleteRegisterPage } from '~/src/application/pages/register/ComplegeRegisterPage';
import { RegisterPage } from '~/src/application/pages/register/RegisterPage';

type RegisterProps = {
  searchParams: Promise<{
    email: string;
    completeRegisterCode: string;
  }>;
};

export default async function Register({ searchParams }: RegisterProps) {
  const { email, completeRegisterCode } = await searchParams;

  if (email && completeRegisterCode) {
    return (
      <CompleteRegisterPage
        email={email}
        completeRegistrationCode={completeRegisterCode}
      />
    );
  }

  return <RegisterPage />;
}
