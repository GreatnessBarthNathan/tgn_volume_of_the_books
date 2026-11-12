import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useDeleteChapter, useGetChapters } from '../queries/chapters'
import { ChapterType } from '../utils/types'
import { useGetBook } from '../queries/books'
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiEdit2,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi'
import Loading from '../components/Loading'
import { useAdminSession } from '../queries/auth'
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'

function Chapters() {
  const [search, setSearch] = useState('')
  const { year } = useParams()

  const { data: book } = useGetBook(Number(year))

  const { data, isError, isLoading } = useGetChapters(Number(year))
  const { data: admin } = useAdminSession()
  const { mutate: deleteChapter } = useDeleteChapter()

  const visibleChapters = useMemo(
    () =>
      (data || []).filter((chapter: ChapterType) =>
        `${chapter.name} ${chapter.word} ${chapter.declaration}`
          .toLowerCase()
          .includes(search.trim().toLowerCase()),
      ),
    [data, search],
  )

  if (isError) {
    return (
      <p className='error-state'>
        This volume could not be loaded. Please try again.
      </p>
    )
  }

  if (isLoading) return <Loading />
  return (
    <div>
      <Link to='/' className='detail-back'>
        <FiArrowLeft aria-hidden='true' />
        All Books
      </Link>
      {book && (
        <section className='detail-heading' key={book._id}>
          <span className='section-eyebrow'>Book {book.year}</span>
          <h1 className='detail-title'>{book.word}</h1>
          <p className='detail-copy'>{book.synopsis}</p>
          <p className='archive-count'>
            {data?.length ?? 0}{' '}
            {(data?.length ?? 0) === 1 ? 'chapter' : 'chapters'}
          </p>
        </section>
      )}
      {!book && (
        <section className='detail-heading'>
          <span className='section-eyebrow'>Volume {year}</span>
          <h1 className='detail-title'>Monthly chapters</h1>
          <p className='archive-count'>
            {data?.length ?? 0}{' '}
            {(data?.length ?? 0) === 1 ? 'chapter' : 'chapters'}
          </p>
        </section>
      )}
      <div className='archive-toolbar'>
        <div>
          <span className='section-eyebrow'>The journey, month by month</span>
          <h2 className='section-title'>Choose a chapter</h2>
        </div>
        <label className='search-control'>
          <FiSearch aria-hidden='true' />
          <span className='sr-only'>Search chapters</span>
          <input
            type='search'
            placeholder='Find a month or word'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      {!visibleChapters.length ? (
        <p className='empty-state'>
          {search
            ? 'No chapters match your search.'
            : 'No chapters in this volume yet.'}
        </p>
      ) : (
        <div className='chapter-grid'>
          {visibleChapters.map((chapter: ChapterType, index: number) => {
            const monthNumber = chapter.date
              ? new Date(`${chapter.date}T00:00:00`).getMonth() + 1
              : index + 1
            return (
              <article className='chapter-card' key={chapter._id}>
                <Link
                  to={`/verses/${year}-${chapter.name}`}
                  className='chapter-card-main'
                >
                  <span className='chapter-month-mark'>
                    {String(monthNumber).padStart(2, '0')}
                  </span>
                  <span className='min-w-0'>
                    <span className='chapter-title block'>{chapter.name}</span>
                    <span className='chapter-subtitle block'>
                      {chapter.word
                        ? `“${chapter.word}”`
                        : 'Monthly reflection'}
                    </span>
                  </span>
                </Link>
                {admin ? (
                  <span className='chapter-actions'>
                    <Link
                      to={`/edit-chapter/${chapter.book}-${chapter.name}`}
                      className='icon-action'
                      aria-label={`Edit ${chapter.name} chapter`}
                      title='Edit chapter'
                    >
                      <FiEdit2 aria-hidden='true' />
                    </Link>
                    <button
                      type='button'
                      className='icon-action icon-action-danger'
                      aria-label={`Delete ${chapter.name} chapter`}
                      title='Delete chapter'
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${chapter.name} and all its verses?`,
                          )
                        ) {
                          deleteChapter(`${chapter.book}-${chapter.name}`, {
                            onSuccess: () => toast.success('Chapter deleted'),
                            onError: (error) =>
                              toast.error(
                                isAxiosError(error)
                                  ? error.response?.data?.msg ||
                                      'Unable to delete chapter'
                                  : 'Unable to delete chapter',
                              ),
                          })
                        }
                      }}
                    >
                      <FiTrash2 aria-hidden='true' />
                    </button>
                  </span>
                ) : (
                  <FiArrowUpRight className='card-arrow' aria-hidden='true' />
                )}
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Chapters
