"use client"
import Link from "next/link"
import { ArrowLeft, Minus, Plus, ShoppingBasket, Trash2 } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useSelector } from "react-redux"
import { RootState } from "@/src/redux/store"
import Image from "next/image"
import { decreaseQuantity, increaseQuantity, removeFromCart } from "@/src/redux/cartSlice"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/src/redux/store"
import { useRouter } from "next/navigation"


function CartPage() {
    const {cartData,subTotal,deliveryFee,finalTotal} = useSelector((state:RootState)=>state.cart)
    const dispatch = useDispatch<AppDispatch>()
    const router = useRouter()
    return (
        <div className="w-[95%] sm:w-[90%] md:w-[80%] mx-auto mt-8 mb-24 relative">
            <Link href="/" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"><ArrowLeft/> Back to Home</Link>
            <motion.h2
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.5}}
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mt-6 text-center mb-10 "
            >
                Your Shopping Cart 🛒
            </motion.h2>
            {
            cartData.length == 0 ? (
                <motion.div
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                transition={{duration:0.5}}
                className="text-center py-20 bg-white rounded-2xl shadow-md"
                >
                    <ShoppingBasket className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                    <h3 className="text-lg font-semibold text-gray-600 mb-6">Your cart is empty. Add some groceries to continue shopping!</h3>
                    <Link href="/" className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 font-semibold flex items-center gap-2 inline-block">Continue Shopping</Link>
                </motion.div>
            ):(
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-5">
                        <AnimatePresence>
                            {cartData.map((item,index)=>(
                                <motion.div
                                key={index}
                                initial={{opacity:0,y:20}}
                                animate={{opacity:1,y:0}}
                                exit={{opacity:0,y:20}}
                                transition={{duration:0.5}}
                                className="flex flex-col sm:flex-row items-center bg-white rounded-2xl shadow-md p-5 hover:shadow-xl transition-all duration-300 border border-gray-100 mb-4"
                                >
                                    <div className="relative w-28 h-28 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-50">
                                        <Image src={item.image} alt={item.name} fill className="object-cover p-3 transition-transform duration-300 hover:scale-110"/>
                                    </div>
                                    <div className="mt-4 sm:mt-0 sm:ml-4 flex-1 text-center sm:text-left">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 line-clamp-2">{item.name}</h3>
                                        <p className="text-gray-600 text-xs sm:text-sm">{item.unit}</p>
                                        <p className="text-green-700 text-sm sm:text-base font-bold">৳{Number(item.price)*item.quantity}</p>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-end gap-3 mt-3 sm:mt-0 bg-gray-50 px-3 py-2 rounded-full">
                                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-green-200 transition-all " onClick={() => dispatch(decreaseQuantity(item._id!))}><Minus size={16} className="text-green-700" /></button>
                                        <span className="text-gray-700 font-semibold">{item.quantity}</span>
                                        <button className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-green-200 transition-all " onClick={() => dispatch(increaseQuantity(item._id!))}><Plus size={16} className="text-green-700" /></button>
                                    </div>
                                    <button className="mt-3 sm:mt-0 sm:ml-4 text-red-500 hover:text-red-600 transition-colors" onClick={() => dispatch(removeFromCart(item._id!))}><Trash2 size={16} /></button>
                                </motion.div>
                            ))}

                        </AnimatePresence>
                    </div>
                    
                        <motion.div
                        initial={{opacity:0,y:20}}
                        animate={{opacity:1,y:0}}
                        transition={{duration:0.5}}
                        className="bg-white rounded-2xl shadow-md p-5"
                        >
                            <h3 className="text-lg font-semibold text-gray-600 mb-6">Order Summary</h3>
                            
                            <div className="space-y-3 text-gray-700 text-sm sm:text-base">
                                <div className="flex justify-between">
                                    <span>SubTotal</span>
                                    <span className="text-green-700 font-semibold">৳{subTotal}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Delivery Fee</span>
                                    <span className="text-green-700 font-semibold">৳{deliveryFee}</span>
                                </div>
                                <hr className="my-3"/>
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Final Total</span>
                                    <span className="text-green-700 font-bold">৳{finalTotal}</span>
                                </div>
                                
                            </div>
                            <motion.button 
                            whileHover={{scale:1.05}}
                            whileTap={{scale:0.95}}
                            className="w-full bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700 font-semibold flex items-center justify-center gap-2 mt-8" onClick={()=>router.push("/user/checkout")}
                            >
                                <Link href="/user/checkout">Proceed to Checkout</Link>
                            </motion.button>
                        </motion.div>
                    </div>
                
            )
            }
        </div>
    )
}

export default CartPage