import { Metadata } from 'next'

import { ForgotPasswordForm } from '@/components/forms/forgot-password'

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Forgot password to your account.',
}

export default function LoginForm() {
  return <ForgotPasswordForm />
}
