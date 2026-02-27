"use client"
import React, { useMemo } from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import GroceryItemCard from './GroceryItemCard'
import mongoose from 'mongoose'
import { useSearchParams } from 'next/navigation'

interface IGrocery {
  _id?: mongoose.Types.ObjectId
  name: string
  category: string
  price: string
  unit: string
  image: string
  createdAt?: Date
  updatedAt?: Date
}

interface UserDashboardClientProps {
  groceries: IGrocery[]
}

function UserDashboardClient({ groceries }: UserDashboardClientProps) {
  const searchParams = useSearchParams()
  
  const filteredGroceries = useMemo(() => {
    const search = searchParams.get('search')
    if (search) {
      const query = search.toLowerCase()
      return groceries.filter((item) => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      )
    }
    return groceries
  }, [searchParams, groceries])
  
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <div className='w-[90%] md:w-[80%] mx-auto mt-10'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6 text-center text-green-700'>
          {searchParams.get('search') ? `Search Results for "${searchParams.get('search')}"` : 'Popular Grocery Items'}
        </h2>
        {filteredGroceries.length > 0 ? (
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {filteredGroceries.map((item: IGrocery, index: number) => (
              <GroceryItemCard item={item} key={index} />
            ))}
          </div>
        ) : (
          <div className='text-center text-gray-500 py-10'>
            <p className='text-lg'>No groceries found matching your search.</p>
            <p className='text-sm mt-2'>Try searching with different keywords.</p>
          </div>
        )}
      </div>
    </>
  )
}

export default UserDashboardClient
