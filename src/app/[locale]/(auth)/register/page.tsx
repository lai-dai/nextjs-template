import { Metadata } from 'next'

import { RegisterForm } from '@/components/forms/register'

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create an account to get started.',
}

export default function IndexPage() {
  return <RegisterForm />
}
