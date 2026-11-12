import { FormEvent, useState } from "react"
import { Link } from "react-router-dom"
import { FiSearch } from "react-icons/fi"
import Loading from "./Loading"
import { useSearchArchive } from "../queries/search"

function HomeSearch() {
  const [search, setSearch] = useState("")
  const [submittedSearch, setSubmittedSearch] = useState("")
  const { data, isLoading, isError } = useSearchArchive(submittedSearch)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedSearch(search.trim())
  }

  const hasResults = Boolean(data?.chapters.length || data?.verses.length)

  return (
    <section className='home-search' aria-labelledby='home-search-heading'>
      <div>
        <span className='section-eyebrow'>
          <FiSearch aria-hidden='true' />
          Search the archive
        </span>
        <h2 className='section-title' id='home-search-heading'>
          Find a chapter or verse
        </h2>
      </div>
      <form className='home-search-form' onSubmit={handleSubmit}>
        <label className='search-control'>
          <FiSearch aria-hidden='true' />
          <span className='sr-only'>Search chapters and verses</span>
          <input
            type='search'
            maxLength={100}
            placeholder='Search chapter titles or verse text'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
        <button type='submit' className='home-search-button' disabled={!search.trim()}>
          Search
        </button>
      </form>

      {submittedSearch && (
        <div className='home-search-results' aria-live='polite'>
          {isLoading ? (
            <Loading />
          ) : isError ? (
            <p className='error-state'>
              Search is unavailable. Please try again.
            </p>
          ) : !hasResults ? (
            <p className='empty-state'>
              No chapters or verses match “{submittedSearch}”.
            </p>
          ) : (
            <>
              {data.chapters.length > 0 && (
                <section aria-labelledby='chapter-results-heading'>
                  <h3 className='search-results-heading' id='chapter-results-heading'>
                    Chapters
                  </h3>
                  <ul className='search-results-list'>
                    {data.chapters.map((chapter) => (
                      <li key={chapter._id}>
                        <Link
                          to={`/verses/${chapter.book}-${chapter.name}`}
                          className='search-result-link'
                        >
                          <span className='search-result-title'>
                            {chapter.name} {chapter.book}
                            {chapter.word ? ` · ${chapter.word}` : ""}
                          </span>
                          {chapter.declaration && (
                            <span className='search-result-copy'>
                              {chapter.declaration}
                            </span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {data.verses.length > 0 && (
                <section aria-labelledby='verse-results-heading'>
                  <h3 className='search-results-heading' id='verse-results-heading'>
                    Verses
                  </h3>
                  <ul className='search-results-list'>
                    {data.verses.map((verse) => (
                      <li key={verse._id}>
                        <Link
                          to={`/verses/${verse.book}-${verse.chapter}?search=${encodeURIComponent(submittedSearch)}`}
                          className='search-result-link'
                        >
                          <span className='search-result-title'>
                            {verse.chapter} {verse.book}
                          </span>
                          <span className='search-result-copy'>
                            {verse.prophecy}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
              {(data.chapters.length === 30 || data.verses.length === 30) && (
                <p className='search-results-limit'>
                  Showing the first 30 matches in each category. Refine your
                  search to narrow the results.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </section>
  )
}

export default HomeSearch
