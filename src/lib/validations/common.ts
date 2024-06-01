import { z, type ZodType } from 'zod'

import { PAGE_SIZE_OPTIONS } from '@/lib/constants'
import { passwordRegex, vnPhoneRegex } from '@/lib/regex'

export function numericEnum<TValues extends readonly number[]>(
  values: TValues
) {
  return z.number().superRefine((val, ctx) => {
    if (!values.includes(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_enum_value,
        options: [...values],
        received: val,
      })
    }
  }) as ZodType<TValues[number]>
}

export const pageSizeSchema = numericEnum(PAGE_SIZE_OPTIONS).default(20)

export const limitSchema = pageSizeSchema

export type PageSize = z.infer<typeof pageSizeSchema>

export type Limit = PageSize

export const pageSchema = z.number().default(1)

export type Page = z.infer<typeof pageSchema>

export const keySchema = z.string().default('')

export type Key = z.infer<typeof keySchema>

export const textSchema = z
  .string({ required_error: 'Yêu cầu nhập trường này' })
  .min(1, 'Yêu cầu nhập trường này')
  .default('')

export const numberSchema = z.number({
  required_error: 'Yêu cầu nhập trường này',
})

export const dateSchema = z.date({
  required_error: 'Yêu cầu nhập trường này',
})

export const booleanSchema = z.boolean({
  required_error: 'Yêu cầu nhập trường này',
})

export const emailSchema = z
  .string({ required_error: 'Yêu cầu nhập trường này' })
  .email('Email không hợp lệ')

export const phoneSchema = z
  .string({ required_error: 'Yêu cầu nhập trường này' })
  .regex(vnPhoneRegex, 'Số điện thoại chưa hợp lệ')

export const passwordSchema = z
  .string({ required_error: 'Yêu cầu nhập trường này' })
  .min(8, 'Yêu cầu nhập ít nhất 8 ký tự')
  .regex(
    passwordRegex,
    'Mật khẩu chưa hợp lệ' // 'Mật khẩu cần ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt'
  )

export const usernameSchema = textSchema.refine(
  (s) => !s.includes(' '),
  'Yêu cầu không có khoảng cách giữa các ký tự'
)
