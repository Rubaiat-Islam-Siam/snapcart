"use client"
import React from 'react'
import HeroSection from './HeroSection'
import CategorySlider from './CategorySlider'
import GroceryItemCard from './GroceryItemCard'
import mongoose from 'mongoose'

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
  return (
    <>
      <HeroSection />
      <CategorySlider />
      <div className='w-[90%] md:w-[80%] mx-auto mt-10'>
        <h2 className='text-2xl md:text-3xl font-bold mb-6 text-center text-green-700'>Popular Grocery Items</h2>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
          {groceries.map((item: IGrocery, index: number) => (
            <GroceryItemCard item={item} key={index} />
          ))}
        </div>
      </div>
    </>
  )
}

export default UserDashboardClient
