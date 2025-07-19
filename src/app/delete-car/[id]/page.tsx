
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DeletePage() {
  const { id } = useParams()
  const router = useRouter()

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
