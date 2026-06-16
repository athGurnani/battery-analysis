'use client'

export default function GlobalError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string }
  unstable_retry: () => void
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col items-center justify-center bg-[#08080e] font-sans text-zinc-300">
        <div className="rounded-xl border border-zinc-800/60 bg-[#0c0c14] p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-900/40 text-2xl">
            !
          </div>
          <h1 className="text-xl font-bold text-zinc-100">
            Something went wrong
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            {error.digest
              ? 'A server error occurred. Try reloading.'
              : 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => unstable_retry()}
            className="mt-6 rounded-lg bg-cyan-600 px-5 py-2 text-sm font-semibold text-black transition-all hover:bg-cyan-500"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  )
}
