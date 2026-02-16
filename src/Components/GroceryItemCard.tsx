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
        className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200/80 hover:border-green-200 flex flex-col overflow-hidden group/card"
        >
            <div className="relative w-full aspect-4/3 bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden" >
                <Image src={item.image} alt={item.name} fill sizes="(max-width:768px) 100vw,25vw" className="object-contain p-4 transition-transform duration-500 group-hover/card:scale-110"/>
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"/>
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-green-600 shadow-sm opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform translate-y-1 group-hover/card:translate-y-0">
                    {item.category}
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <p className="text-green-600 text-xs font-semibold tracking-wider uppercase mb-2 group-hover/card:text-gray-700 transition-colors duration-300">{item.category}</p>
                <h3 className="text-gray-900 font-bold text-lg mb-3 line-clamp-2 group-hover/card:text-green-700 transition-colors duration-300">{item.name}</h3>
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2">
                        <span className="text-gray-400 text-xs font-medium">Unit</span>
                        <span className="text-gray-700 text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-50 px-3 py-1.5 rounded-full border border-gray-200/50">{item.unit}</span>
                    </div>                 
                    <span className="text-green-600 font-bold text-xl">৳{item.price}</span>
                </div>
                <motion.button whileHover={{scale:1.03}} whileTap={{scale:0.97}} className="mt-5 bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-xl hover:from-green-700 hover:to-green-600 transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg font-medium">
                    <ShoppingCart className="w-4 h-4"/>Add to Cart
                </motion.button>
            </div>
            
        </motion.div>
    )
}

export default GroceryItemCard