import { FormEvent } from "react"
import { useCreateBook } from "../queries/books"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import { useNavigate } from "react-router-dom"

function CreateBook() {
  const navigate = useNavigate()
  const { mutate, isLoading } = useCreateBook()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate(data, {
      onSuccess: () => {
        toast.success("Book created")
        navigate("/")
      },
      onError: (error) =>
        toast.error(
          isAxiosError(error)
            ? error.response?.data?.msg || "Unable to create book"
            : "Unable to create book"
        ),
    })
  }
  return (
    <main className='pb-10'>
      <form
        className='form-card'
        onSubmit={handleSubmit}
      >
        <h1 className='capitalize mb-2 text-center text-[var(--primaryColor)] font-semibold'>
          Create a new book
        </h1>
        <div className='mb-3'>
          <label className='block capitalize font-semibold'>year</label>
          <input
            type='number'
            name='year'
            maxLength={4}
            min={0}
            required
            className='border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
          />
        </div>
        <div className='mb-3'>
          <label className='block capitalize font-semibold'>
            word for the year
          </label>
          <input
            type='text'
            name='word'
            required
            className='border p-1 uppercase w-full border-[var(--primaryColor)] rounded-sm outline-none'
          />
        </div>
        <div className='mb-3'>
          <label className='block capitalize font-semibold'>synopsis</label>
          <textarea
            name='synopsis'
            id=''
            cols={30}
            rows={10}
            className='border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none whitespace-pre-wrap'
            required
          ></textarea>
        </div>
        <button
          type='submit'
          disabled={isLoading}
          className='border p-1 w-full bg-[var(--primaryColor)] rounded-sm text-white capitalize disabled:opacity-60'
        >
          {isLoading ? "submitting" : "submit"}
        </button>
      </form>
    </main>
  )
}

export default CreateBook
