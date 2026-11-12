import { FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import { useEditBook, useGetBook } from "../queries/books"
import Loading from "../components/Loading"

function EditBook() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { mutate, isLoading } = useEditBook()

  const { data, isLoading: isBookLoading, isError: isBookError } = useGetBook(
    Number(id)
  )

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)

    mutate(
      { param: id as string, data },
      {
        onSuccess: () => {
          toast.success("Book updated")
          navigate("/")
        },
        onError: (error) =>
          toast.error(
            isAxiosError(error)
              ? error.response?.data?.msg || "Unable to update book"
              : "Unable to update book"
          ),
      }
    )
  }

  if (isBookLoading) return <Loading />
  if (isBookError || !data) {
    return <h2 className='text-center'>Book not found</h2>
  }

  return (
    <main>
      <form
        className='form-card'
        onSubmit={handleSubmit}
      >
        <h1 className='capitalize mb-2 text-center text-[var(--primaryColor)] font-semibold'>
          Edit Book
        </h1>
        <div className='mb-3'>
          <label className='block capitalize font-semibold'>year</label>
          <input
            type='number'
            name='year'
            maxLength={4}
            min={0}
            defaultValue={data && data.year}
            readOnly
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
            defaultValue={data && data.word}
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
            defaultValue={data && data.synopsis}
            className='border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none whitespace-pre-wrap'
            required
          ></textarea>
        </div>

        <button
          type='submit'
          disabled={isLoading}
          className='border p-1 w-full bg-[var(--primaryColor)] rounded-sm text-white capitalize'
        >
          {isLoading ? "submitting" : "submit"}
        </button>
      </form>
    </main>
  )
}

export default EditBook
