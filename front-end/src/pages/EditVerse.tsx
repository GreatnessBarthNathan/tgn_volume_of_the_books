import { FormEvent } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useEditVerse, useGetVerse } from "../queries/verses"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import Loading from "../components/Loading"

function EditVerse() {
  const navigate = useNavigate()
  const { id } = useParams()
  const {
    mutate,
    isLoading,
  } = useEditVerse()
  const {
    data: verse,
    isLoading: isVerseLoading,
    isError: isVerseError,
  } = useGetVerse(id as string)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate(
      { param: id as string, data },
      {
        onSuccess: (response) => {
          toast.success("Verse updated")
          const updated = response.data.verse
          navigate(`/verses/${updated.book}-${updated.chapter}`)
        },
        onError: (error) =>
          toast.error(
            isAxiosError(error)
              ? error.response?.data?.msg || "Unable to update verse"
              : "Unable to update verse"
          ),
      }
    )
  }

  if (isVerseLoading) return <Loading />
  if (isVerseError || !verse) {
    return <h2 className='text-center'>Verse not found</h2>
  }
  return (
    <main>
      <form
        className='form-card'
        onSubmit={handleSubmit}
      >
        <h1 className='capitalize mb-2 text-center text-[var(--primaryColor)] font-semibold'>
          Edit Verse
        </h1>
        <div className='mb-3'>
          <label className='block capitalize font-semibold'>
            Date of Prophecy
          </label>
          <input
            type='date'
            name='date'
            defaultValue={verse.date}
            required
            className='border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
          />
        </div>

        <div className='mb-3'>
          <label className='block capitalize font-semibold'>prophecy</label>
          <textarea
            name='prophecy'
            id=''
            cols={30}
            rows={10}
            defaultValue={verse.prophecy}
            required
            className='border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none whitespace-pre-wrap'
          ></textarea>
        </div>

        <button
          type='submit'
          className={`border p-1 w-full bg-[var(--primaryColor)] rounded-sm text-white capitalize ${
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

export default EditVerse
