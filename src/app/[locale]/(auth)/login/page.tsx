import { Metadata } from 'next'

import { LoginForm } from '@/components/forms/login'

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your account',
}

export default function IndexPage() {
  return <LoginForm />
}
