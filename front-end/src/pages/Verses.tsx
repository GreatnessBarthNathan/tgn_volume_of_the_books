import { useMemo, useState } from "react"
import { useParams, useSearchParams } from "react-router-dom"
import { useGetVerses } from "../queries/verses"
import { VerseType } from "../utils/types"
import { useSingleChapter } from "../queries/chapters"
import { Link } from "react-router-dom"
import { FiArrowLeft, FiSearch } from "react-icons/fi"
import SingleVerse from "../components/SingleVerse"
import Loading from "../components/Loading"

function Verses() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  const { data: chapter } = useSingleChapter(id as string)

  const { data, isError, isLoading } = useGetVerses(id as string)

  const visibleVerses = useMemo(
    () =>
      (data || []).filter((verse: VerseType) =>
        `${verse.prophecy} ${verse.date}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      ),
    [data, search]
  )

  if (isError) {
    return <p className='error-state'>This chapter could not be loaded. Please try again.</p>
  }

  if (isLoading) return <Loading />

  return (
    <div className='mb-10'>
      <Link to={`/books/${chapter?.book ?? id?.split("-")[0]}`} className='detail-back'>
        <FiArrowLeft aria-hidden='true' />
        Back to {chapter?.book ?? "volume"}
      </Link>
      {chapter && (
        <section className='detail-heading'>
          <span className='section-eyebrow'>
            {chapter.name} · {chapter.book}
          </span>
          <h1 className='detail-title'>{chapter.word}</h1>
          <p className='detail-copy'>{chapter.declaration}</p>
          <p className='archive-count'>
            {data?.length ?? 0} {(data?.length ?? 0) === 1 ? "verse" : "verses"}
          </p>
        </section>
      )}
      <div className='verse-toolbar'>
        <span className='section-eyebrow'>Words for reflection</span>
        <label className='search-control'>
          <FiSearch aria-hidden='true' />
          <span className='sr-only'>Search verses</span>
          <input
            type='search'
            placeholder='Search this chapter'
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>
      </div>
      {!visibleVerses.length ? (
        <p className='empty-state'>
          {search
            ? "No verses match your search."
            : "No verses have been added to this chapter yet."}
        </p>
      ) : (
        <div className='verse-list'>
          {visibleVerses.map((verse: VerseType, index: number) => (
            <SingleVerse key={verse._id} index={index} {...verse} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Verses
