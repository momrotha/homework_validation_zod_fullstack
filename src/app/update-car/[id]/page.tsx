

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  model: z.string().min(1, 'Model is required'),
  year: z.string().min(4, 'Year is required'),

})

type FormData = z.infer<typeof schema>

export default function UpdateCarPage() {
  const { id } = useParams()
  const router = useRouter()

  const [loading, setLoading] = useState(true)

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      brand: '',
      model: '',
      year: '',
      
    },
  })

  useEffect(() => {
    const fetchCar = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`)
      const car = await res.json()
      form.reset({
        brand: car.brand,
        model: car.model,
        year: car.year,
      })
      setLoading(false)
    }

    if (id) fetchCar()
  }, [id])

  const onSubmit = async (data: FormData) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cars/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (res.ok) {
      router.push('/dashboard')
    } else {
      alert('Failed to update car')
    }
  }

  if (loading) return <p>Loading...</p>

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label>Brand:</label>
        <input {...form.register('brand')} className="border" />
      </div>
      <div>
        <label>Model:</label>
        <input {...form.register('model')} className="border" />
      </div>
      <div>
        <label>Year:</label>
        <input {...form.register('year')} className="border" />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2">Update</button>
    </form>
  )
}
