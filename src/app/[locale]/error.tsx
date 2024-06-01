'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset(): void
}) {
  const router = useRouter()

  React.useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        Error!
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">
        Something&apos;s missing
      </h2>
      <pre className="max-w-2xl whitespace-pre-wrap">
        {JSON.stringify(error.message, null, 2)}
      </pre>
      <div className="mt-8 flex justify-center gap-2">
        <Button
          onClick={() => router.back()}
          variant="default"
          size="lg"
          className="rounded-full"
        >
          Quay lại
        </Button>
        <Button
          onClick={() => reset()}
          variant="outline"
          size="lg"
          className="rounded-full"
        >
          Tải lại
        </Button>
        <Button
          onClick={() => router.replace('/')}
          variant="secondary"
          size="lg"
          className="rounded-full"
        >
          Trang chủ
        </Button>
      </div>
    </div>
  )

  return (
    <div className="grid h-svh place-content-center text-center">
      <h1 className="text-xl font-semibold">Lỗi</h1>
      <pre className="whitespace-pre-wrap">
        {JSON.stringify(error.message, null, 2)}
      </pre>
    </div>
  )
}
