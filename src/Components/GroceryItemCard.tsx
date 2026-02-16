"use client"
import { ShoppingCart } from "lucide-react"
import mongoose from "mongoose"
import { motion } from "motion/react"
import Image from "next/image"

interface IGrocery {
    _id?: mongoose.Types.ObjectId,
    name:string,
    category:string,
    price:string,
    unit:string,
    image:string,
    createdAt?: Date,
    updatedAt?: Date
}

function GroceryItemCard({item}:{item:IGrocery}) {
    return (
        <motion.div 
        initial={{opacity:0,y:50,scale:0.9}}
        whileInView={{opacity:1,y:0,scale:1}}
        transition={{duration:0.6}}
        viewport={{once:false,amount:0.3}}
        className="bg-white rounded-2xl shadow-sm  hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 flex flex-col overflow-hidden"
        >
            <div className="relative w-full aspect-4/3 bg-gray-50 overflow-hidden group" >
                <Image src={item.image} alt={item.name} fill sizes="(max-width:768px) 100vw,25vw" className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"/>
                <div className="absolute insert-0 top-3 right-3 bg-liner-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 "/>
            </div>

            <div className="p-4 flex flex-col flex-1">
                <p className="text-gray-500 text-xs font-medium mb-1">{item.category}</p>
                <h3 className="text-gray-900 font-semibold text-lg mb-2 line-clamp-2">{item.name}</h3>
                <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm">{item.unit}</span>
                    <span className="text-green-600 font-bold text-lg">৳{item.price}</span>
                </div>
                <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} className="mt-4 bg-green-600 text-white py-2 rounded-full hover:bg-green-700 transition-all duration-300 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5"/>Add to Cart
                </motion.button>
            </div>
            
        </motion.div>
    )
}

export default GroceryItemCard
