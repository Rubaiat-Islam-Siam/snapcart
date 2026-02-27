import React, { Suspense } from 'react'
import UserDashboardClient from './UserDashboardClient'
import { IGrocery } from '../models/grocery.model'
import { Loader2 } from 'lucide-react'

async function UserDashboard({groceryList}: {groceryList: IGrocery[]}) {
  const plainGrocery = JSON.parse(JSON.stringify(groceryList))

  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-green-600" />
      </div>
    }>
      <UserDashboardClient groceries={plainGrocery} />
    </Suspense>
  )
}

export default UserDashboard
