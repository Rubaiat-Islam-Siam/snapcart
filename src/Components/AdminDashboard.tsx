import React from 'react'
import AdminDashboardClient from './AdminDashboardClient'
import connectDb from '../lib/db'
import Order from '../models/order.model'
import User from '../models/user.model'
import Grocery from '../models/grocery.model'

async function AdminDashboard() {
  await connectDb()
  const orders = await Order.find({})
  const users = await User.find({ role: "user" })
  const groceries = await Grocery.find({})

  const totalOrders = orders.length
  const totalUsers = users.length
  const totalGroceries = groceries.length
  const pendingDelivery = orders.filter(order => order.status === "pending").length
  const totalRevenue = orders.reduce((acc, order) => acc + order.totalAmount, 0)

  const today = new Date()
  const startOfToday = new Date(today)
  startOfToday.setHours(0, 0, 0, 0)

  const sevenDaysAgo = new Date(today)
  sevenDaysAgo.setDate(today.getDate() - 6)

  const todayOrders = orders.filter(order => order.createdAt >= startOfToday)
  const todayRevenue = todayOrders.reduce((acc, order) => acc + order.totalAmount, 0)

  const sevenDaysOrders = orders.filter(order => order.createdAt >= sevenDaysAgo)
  const sevenDaysRevenue = sevenDaysOrders.reduce((acc, order) => acc + order.totalAmount, 0)

  const stats = [
    { title: "Total Orders", value: totalOrders },
    { title: "Total Customers", value: totalUsers },
    { title: "Pending Deliveries", value: pendingDelivery },
    { title: "Total Revenue", value: totalRevenue },
  ]

  const chartdata = []

  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    date.setHours(0, 0, 0, 0)

    const nextDay = new Date(date)
    nextDay.setDate(nextDay.getDate() + 1)

    const ordersCount = orders.filter(order => order.createdAt >= date && order.createdAt < nextDay).length

    chartdata.push({
      date: date.toLocaleDateString("en-US", { weekday: "short" }),
      orders: ordersCount
    })
  }



  return (
    <>
      <AdminDashboardClient
        earnings={
          {
            today: todayRevenue,
            sevenDays: sevenDaysRevenue,
            total: totalRevenue
          }
        }
        stats={stats}
        chartdata={chartdata}
      />

    </>
  )
}

export default AdminDashboard
