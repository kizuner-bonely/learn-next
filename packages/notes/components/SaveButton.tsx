import { useFormStatus } from 'react-dom'

export default function EditButton({
  formAction,
}: {
  formAction(formData: FormData): void
}) {
  const { pending } = useFormStatus()

  return (
    <button
      className="note-editor-done"
      formAction={formAction}
      disabled={pending}
      role="menuItem"
      type="submit"
    >
      <img
        src="/checkmark.svg"
        role="presentation"
        height="10px"
        width="14px"
        alt=""
      />
      {pending ? 'Saving...' : 'Save'}
    </button>
  )
}
