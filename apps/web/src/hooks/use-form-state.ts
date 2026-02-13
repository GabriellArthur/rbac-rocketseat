import { useState, useTransition } from 'react'

interface FormState {
  success: boolean
  message: string | null
  errors: Record<string, string[]> | null
}

export function useFormState(
  action: (formData: FormData) => Promise<FormState>,
  onSuccess?: () => Promise<void> | void,
  initialState?: FormState,
) {
  const [isPending, startTransition] = useTransition()

  const [formState, setFormState] = useState(
    initialState ?? { success: false, message: null, errors: null },
  )

  async function handleSubmit(event?: React.FormEvent<HTMLFormElement>) {
    event?.preventDefault()

    const form = event?.currentTarget
    const data = new FormData(form)

    startTransition(async () => {
      const result = await action(data)

      if (result.success === true && onSuccess) {
        await onSuccess()
      }

      setFormState(result)
    })
  }

  return [handleSubmit, formState, isPending] as const
}
