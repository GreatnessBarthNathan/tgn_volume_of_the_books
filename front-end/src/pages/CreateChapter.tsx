import { FormEvent, useState } from "react"
import { useCreateChapter } from "../queries/chapters"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"

function CreateChapter() {
  const [date, setDate] = useState("")
  const [word, setWord] = useState("")
  const [declaration, setDeclaration] = useState("")
  const { mutate, isLoading } = useCreateChapter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData)
    mutate(data, {
      onSuccess: () => {
        toast.success("Chapter created. Create another chapter")
        setDate("")
        setWord("")
        setDeclaration("")
      },
      onError: (error) =>
        toast.error(
          isAxiosError(error)
            ? error.response?.data?.msg || "Unable to create chapter"
            : "Unable to create chapter"
        ),
    })
  }

  return (
    <main className='mb-10'>
      <form
        className='form-card'
        onSubmit={handleSubmit}
      >
        <h1 className='capitalize mb-2 text-center text-[var(--primaryColor)] font-semibold'>
          Create a new chapter
        </h1>
        <div className='mb-3'>
          <label className='block capitalize font-semibold'>
            1st day of the month
          </label>
          <input
            type='date'
            name='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
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
            value={word}
            onChange={(e) => setWord(e.target.value)}
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
            value={declaration}
            onChange={(e) => setDeclaration(e.target.value)}
            required
            className='border p-1 w-full border-[var(--primaryColor)] rounded-sm outline-none'
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

export default CreateChapter
