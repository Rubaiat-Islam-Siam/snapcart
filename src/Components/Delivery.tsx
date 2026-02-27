import { auth } from "../auth"
import connectDb from "../lib/db"
import Order from "../models/order.model"
import { IOder } from "../models/order.model"
import DeliveryDashboad from "./DeliveryDashboad"

async function Delivery() {
    await connectDb()
    const session = await auth()
    const deliveryBoyId = session?.user?.id
    const orders = await Order.find({ assignedDeliveryBoy: deliveryBoyId, deliveryOtpVerification: true })    

    const today = new Date().toDateString()
    const todayOrders = orders.filter((o: IOder) => o.createdAt && new Date(o.createdAt).toDateString() === today).length
    const todayEarnings = todayOrders * 60
    
    return (
        
        <DeliveryDashboad earning={todayEarnings}/>
        
    )
}

export default Delivery