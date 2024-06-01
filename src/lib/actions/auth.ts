import * as dateFns from 'date-fns'
import { getServerSession } from 'next-auth'
import { signOut } from 'next-auth/react'

import { atomStore } from '@/components/providers/jotai'

import { api } from '../api'
import { userAtom } from '../atom/auth'
import { RawUser } from '../types/auth'
import { SignInUser, SignUpUser } from '../validations/auth'

export const currentUser = async () => {
  const session = await getServerSession()

  return session?.user
}

export function signUpUser(data: SignUpUser) {
  return api.post<RawUser>('/api/auth/local/register', {
    birthday: dateFns.format(data.birthday, 'yyyy-MM-dd'),
    email: data.email,
    fullname: data.fullname,
    password: data.password,
    phone: data.phone,
    username: data.phone,
  })
}

export function signInUser(data: SignInUser) {
  return api.post<RawUser>('/api/auth/local', {
    identifier: data.email,
    password: data.password,
  })
}

type SignOutOption<R> = {
  redirectTo?: string
  redirect?: R
}

export async function signOutUser<R extends boolean = true>(
  options: SignOutOption<R> = {}
) {
  atomStore.set(userAtom, undefined)
  await signOut(options)
}
