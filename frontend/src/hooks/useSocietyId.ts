import { useSearchParams } from 'react-router-dom'

export function useSocietyId() {
  const [searchParams] = useSearchParams()

  return searchParams.get('societyId')
}