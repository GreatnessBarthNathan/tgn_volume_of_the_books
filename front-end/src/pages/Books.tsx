import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDeleteBook, useGetBooks } from '../queries/books'
import { BookType } from '../utils/types'
import {
  FiArrowUpRight,
  FiBookOpen,
  FiEdit2,
  FiSearch,
  FiTrash2,
} from 'react-icons/fi'
import Loading from '../components/Loading'
import { useAdminSession } from '../queries/auth'
import { isAxiosError } from 'axios'
import { toast } from 'react-toastify'
import HomeSearch from '../components/HomeSearch'

function Books() {
  const [search, setSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest')
  const { data, isLoading, isError } = useGetBooks()
  const { data: admin } = useAdminSession()
  const { mutate: deleteBook } = useDeleteBook()

  const visibleBooks = useMemo(() => {
    const books = (data || []).filter((book: BookType) =>
      `${book.year} ${book.word} ${book.synopsis}`
        .toLowerCase()
        .includes(search.trim().toLowerCase()),
    )
    return books.sort((first: BookType, second: BookType) =>
      sortOrder === 'newest'
        ? second.year - first.year
        : first.year - second.year,
    )
  }, [data, search, sortOrder])

  if (isError) {
    return (
      <p className='error-state'>
        The archive could not be loaded. Please try again.
      </p>
    )
  }

  return (
    <div>
      <section className='hero-panel'>
        <span className='hero-eyebrow'>Words to live by</span>
        <h1 className='hero-title'>
          The things that
          <br />
          belong to our <em>peace.</em>
        </h1>
        {/* <p className='hero-description'>
          A year-by-year collection of words, declarations, and moments of
          reflection. Find a volume, take your time, and return whenever you
          need it.
        </p> */}
        <blockquote className='hero-quote'>
          “Use those words as weapons in order to fight well.”
          <span className='quote-reference'>1 Timothy 1:18 · GNT</span>
        </blockquote>
      </section>

      <HomeSearch />

      <section aria-labelledby='archive-heading'>
        <div className='archive-toolbar'>
          <div>
            <span className='section-eyebrow'>
              <FiBookOpen aria-hidden='true' />
              The collection
            </span>
            <h2 className='section-title' id='archive-heading'>
              BOOKS
            </h2>
            <p className='archive-count'>
              {data?.length ?? 0} {(data?.length ?? 0) === 1 ? 'book' : 'books'}
            </p>
          </div>
          <div className='toolbar-controls'>
            <label className='search-control'>
              <FiSearch aria-hidden='true' />
              <span className='sr-only'>Search books</span>
              <input
                type='search'
                placeholder='Search year, word, or synopsis'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </label>
            <label>
              <span className='sr-only'>Sort books</span>
              <select
                className='select-control'
                value={sortOrder}
                onChange={(event) =>
                  setSortOrder(event.target.value as 'newest' | 'oldest')
                }
              >
                <option value='newest'>Newest</option>
                <option value='oldest'>Oldest</option>
              </select>
            </label>
          </div>
        </div>

        {isLoading ? (
          <Loading />
        ) : visibleBooks.length ? (
          <div className='book-grid'>
            {visibleBooks.map((book: BookType) => (
              <article className='book-card' key={book._id}>
                <Link
                  to={`/books/${book.year}`}
                  className='book-card-main'
                  aria-label={`Open ${book.year}: ${book.word}`}
                >
                  <span className='book-year-mark'>{book.year}</span>
                  <span className='min-w-0'>
                    <span className='book-title block'>
                      {book.word.toLowerCase()}
                    </span>
                    <span className='book-subtitle block'>
                      {book.synopsis || 'A volume of reflections'}
                    </span>
                  </span>
                </Link>
                {admin ? (
                  <span className='book-actions'>
                    <Link
                      to={`/edit-book/${book.year}`}
                      className='icon-action'
                      aria-label={`Edit ${book.year} volume`}
                      title='Edit volume'
                    >
                      <FiEdit2 aria-hidden='true' />
                    </Link>
                    <button
                      type='button'
                      className='icon-action icon-action-danger'
                      aria-label={`Delete ${book.year} volume`}
                      title='Delete volume'
                      onClick={() => {
                        if (
                          window.confirm(
                            `Delete ${book.year} and all its chapters and verses?`,
                          )
                        ) {
                          deleteBook(book.year, {
                            onSuccess: () => toast.success('Volume deleted'),
                            onError: (error) =>
                              toast.error(
                                isAxiosError(error)
                                  ? error.response?.data?.msg ||
                                      'Unable to delete volume'
                                  : 'Unable to delete volume',
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
            ))}
          </div>
        ) : (
          <p className='empty-state'>
            {search
              ? 'No volumes match your search. Try another word or year.'
              : 'No volumes have been added to the archive yet.'}
          </p>
        )}
      </section>
    </div>
  )
}

export default Books
