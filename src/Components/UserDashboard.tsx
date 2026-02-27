import React from 'react'
import UserDashboardClient from './UserDashboardClient'
import { IGrocery } from '../models/grocery.model'

async function UserDashboard({groceryList}: {groceryList: IGrocery[]}) {
  const plainGrocery = JSON.parse(JSON.stringify(groceryList))

  return <UserDashboardClient groceries={plainGrocery} />
}

export default UserDashboard
