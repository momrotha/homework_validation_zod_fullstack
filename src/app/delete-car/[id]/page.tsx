
'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function DeletePage() {
  const { car_id } = useParams()
  const router = useRouter()

  useEffect(() => {
    if (!car_id) {
      alert('Missing ID')
      router.push('/')
      return
    }
    async function deleteCar() {
      const res = await fetch(`/api/cars/${car_id}`, {
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
  }, [car_id, router])

  return <p>Deleting...</p>
}
