import React from 'react'
import UserDashboardClient from './UserDashboardClient'
import connectDb from '../lib/db'
import Grocery from '../models/grocery.model'

async function UserDashboard() {
  await connectDb()
  const groceries = await Grocery.find({})
  const plainGrocery = JSON.parse(JSON.stringify(groceries))

  return <UserDashboardClient groceries={plainGrocery} />
}

export default UserDashboard
