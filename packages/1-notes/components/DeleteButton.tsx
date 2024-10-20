import { useFormStatus } from 'react-dom'

type Props = {
  isDraft: boolean
  formAction(formData: FormData): void
}

export default function DeleteButton({ isDraft, formAction }: Props) {
  const { pending } = useFormStatus()

  if (isDraft) return null
  return (
    <button
      className="note-editor-delete"
      formAction={formAction}
      disabled={pending}
      role="menuitem"
    >
      <img
        role="presentation"
        src="/cross.svg"
        height="10px"
        width="10px"
        alt=""
      />
      Delete
    </button>
  )
}
