import { ForgotPasswordPage } from '~/src/application/pages/forgot-password/ForgotPasswordPage';
import { ResetPasswordPage } from '~/src/application/pages/forgot-password/ResetPasswordPage';

type ForgotPasswordProps = {
  searchParams: Promise<{
    email: string;
    forgotPasswordCode: string;
  }>;
};

export default async function ForgotPassword({
  searchParams,
}: ForgotPasswordProps) {
  const { email, forgotPasswordCode } = await searchParams;

  if (email && forgotPasswordCode) {
    return (
      <ResetPasswordPage
        email={email}
        forgotPasswordCode={forgotPasswordCode}
      />
    );
  }

  return <ForgotPasswordPage />;
}
