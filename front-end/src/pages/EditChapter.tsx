import { FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import { useEditChapter, useSingleChapter } from "../queries/chapters"
import Loading from "../components/Loading"

function EditChapter() {
  const navigate = useNavigate()
  const { id } = useParams()

  const { mutate, isLoading } = useEditChapter()

  const {
    data,
    isLoading: isChapterLoading,
    isError: isChapterError,
  } = useSingleChapter(id as string)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate(
      { param: id as string, data },
      {
        onSuccess: (response) => {
          toast.success("Chapter updated")
          navigate(`/books/${response.data.chapter.book}`)
        },
        onError: (error) =>
          toast.error(
            isAxiosError(error)
              ? error.response?.data?.msg || "Unable to update chapter"
              : "Unable to update chapter"
          ),
      }
    )
  }

  if (isChapterLoading) return <Loading />
  if (isChapterError || !data) {
    return <h2 className='text-center'>Chapter not found</h2>
  }

  return (
    <main>
      <form
        className='form-card'
        onSubmit={handleSubmit}
      >
        <h1 className='capitalize mb-2 text-center text-[var(--primaryColor)] font-semibold'>
          Edit Chapter
        </h1>
        <div className='mb-3'>
          <label className='block capitalize font-semibold'>
            1st day of the month
          </label>
          <input
            type='date'
            name='date'
            defaultValue={data && data.date}
            required
            readOnly
            className='border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
          />
        </div>
        <div className='mb-3'>
          <label className='block capitalize font-semibold'>
            word for the month
          </label>
          <input
            type='text'
            name='word'
            defaultValue={data && data.word}
            required
            className='uppercase border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
          />
        </div>

        <div className='mb-3'>
          <label className='block capitalize font-semibold'>declaration</label>
          <textarea
            name='declaration'
            id=''
            cols={30}
            rows={10}
            defaultValue={data && data.declaration}
            required
            className='border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none whitespace-pre-wrap'
          ></textarea>
        </div>

        <button
          type='submit'
          className={`border p-1 w-full bg-[var(--primaryColor)] rounded-sm text-white capitalize whitespace-pre-wrap ${
            isLoading && "cursor-wait"
          }`}
          disabled={isLoading}
        >
          {isLoading ? "submitting" : "submit"}
        </button>
      </form>
    </main>
  )
}

export default EditChapter
