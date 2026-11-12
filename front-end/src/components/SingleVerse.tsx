import { Link } from "react-router-dom"
import { FaEdit } from "react-icons/fa"
import { FaTrash } from "react-icons/fa6"
import { VerseType } from "../utils/types"
import { useDeleteVerse } from "../queries/verses"
import { toast } from "react-toastify"
import { isAxiosError } from "axios"
import { useAdminSession } from "../queries/auth"

function SingleVerse({ index, _id, date, prophecy }: VerseType) {
  const { data: admin } = useAdminSession()
  const { mutate: deleteVerse } = useDeleteVerse()
  const formattedDate = date
    ? new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(
        new Date(`${date}T00:00:00`)
      )
    : ""
  return (
    <article className='verse-card'>
      <div className='verse-meta'>
        <time dateTime={date}>{formattedDate || "A moment to remember"}</time>
        <span className='verse-actions'>
          {admin && (
            <>
              <Link
                to={`/edit-verse/${_id}`}
                className='icon-action'
                aria-label='Edit verse'
                title='Edit verse'
              >
                <FaEdit />
              </Link>
              <button
                type='button'
                className='icon-action icon-action-danger'
                aria-label='Delete verse'
                title='Delete verse'
                onClick={() => {
                  if (window.confirm("Delete this verse?")) {
                    deleteVerse(_id, {
                      onSuccess: () => toast.success("Verse deleted"),
                      onError: (error) =>
                        toast.error(
                          isAxiosError(error)
                            ? error.response?.data?.msg ||
                                "Unable to delete verse"
                            : "Unable to delete verse"
                        ),
                    })
                  }
                }}
              >
                <FaTrash />
              </button>
            </>
          )}
        </span>
      </div>
      <p className='verse-text'>
        <span className='verse-number'>{(index ?? 0) + 1}</span>
        {prophecy}
      </p>
    </article>
  )
}

export default SingleVerse
