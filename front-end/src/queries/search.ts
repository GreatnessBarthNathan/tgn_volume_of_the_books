import { useQuery } from "@tanstack/react-query"
import { searchArchive } from "../api/search"

export const useSearchArchive = (query: string) =>
  useQuery({
    queryKey: ["archive-search", query],
    queryFn: () => searchArchive(query),
    enabled: query.length > 0,
    staleTime: 30_000,
  })
