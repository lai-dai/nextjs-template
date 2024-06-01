import { z } from 'zod'

import {
  booleanSchema,
  dateSchema,
  emailSchema,
  passwordSchema,
  phoneSchema,
  textSchema,
} from './common'

export const signUpUserSchema = z
  .object({
    phone: phoneSchema,
    email: emailSchema,
    fullname: textSchema,
    birthday: dateSchema,
    password: passwordSchema,
    passwordConfirm: textSchema,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: 'Mật khẩu không trùng khớp',
    path: ['passwordConfirm'],
  })

export type SignUpUser = z.infer<typeof signUpUserSchema>

export const signInUserSchema = z.object({
  email: emailSchema,
  password: textSchema,
  rememberMe: booleanSchema.default(false).optional(),
})

export type SignInUser = z.infer<typeof signInUserSchema>

export const forgotPasswordUserSchema = z.object({
  email: emailSchema,
})

export type ForgotPasswordUser = z.infer<typeof forgotPasswordUserSchema>

export const changePasswordUserSchema = z
  .object({
    currentPassword: textSchema,
    password: passwordSchema,
    passwordConfirmation: textSchema,
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: 'Mật khẩu không trùng khớp',
    path: ['passwordConfirmation'],
  })

export type ChangePasswordUser = z.infer<typeof changePasswordUserSchema>
