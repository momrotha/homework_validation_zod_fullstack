
'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DeletePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const id = searchParams.get('id')

  useEffect(() => {
    if (!id) {
      alert('Missing ID')
      router.push('/')
      return
    }
    async function deleteCar() {
      const res = await fetch(`/api/cars/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        alert('Deleted successfully')
        router.push('/')
      } else {
        alert('Failed to delete')
      }
    }
    deleteCar()
  }, [id, router])

  return <p>Deleting...</p>
}
