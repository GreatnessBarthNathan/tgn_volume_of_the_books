import customFetch from "../utils/customFetch"

export type ChapterSearchResult = {
  _id: string
  name: string
  word: string
  declaration: string
  book: number
  date?: string
}

export type VerseSearchResult = {
  _id: string
  prophecy: string
  book: number
  chapter: string
  date?: string
}

export type ArchiveSearchResults = {
  chapters: ChapterSearchResult[]
  verses: VerseSearchResult[]
}

export const searchArchive = async (query: string) => {
  const { data } = await customFetch.get<ArchiveSearchResults>("/search", {
    params: { q: query },
  })
  return data
}
