"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Package, Pencil, Search, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { IGrocery } from "@/src/models/grocery.model"
import Image from "next/image"

function ViewGrocery() {
    const [groceries, setGroceries] = useState<IGrocery[]>([])
    const [editing,setEditing] = useState<IGrocery>()
    const router = useRouter()
    useEffect(() => {
        const getGrocery = async () => {
            try {
                const res = await axios.get("/api/admin/get-grocery")
                console.log(res.data)
                setGroceries(res.data.groceries)
            } catch (error) {
                console.log(error)
            }
        }
        getGrocery()
    })
    return (
        <div className="pt-4 w-[95%] md:w-[85%] mx-auto pb-20">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 text-center sm:text-left"
            >
                <button className="flex items-center gap-2 justify-center bg-green-100 hover:bg-green-200 text-green-600 font-semibold rounded-full px-4 py-2 transition" onClick={() => router.push("/")}><ArrowLeft className="w-5 h-5" />Back</button>
                <h1 className="text-2xl md:text-3xl font-extrabold text-green-700 flex items-center justify-center gap-2 "><Package size={28} />Manage Groceries</h1>
            </motion.div>

            <motion.form
                initial={{ opacity: 0, y: 100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-5 py-3 shadow-sm mb-10 hover:shadow-lg transition-all max-w-lg mx-auto w-full"
            >
                <Search className="w-5 h-5 text-gray-500" />
                <input type="text" placeholder="Search by Name or Category..." className="outline-none w-full text-gray-700 placeholder-gray-400 " />
            </motion.form>

            <div className="space-y-4">
                {groceries.map((grocery, index) => (
                    <motion.div
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        transition={{type: "spring", stiffness: 100}}
                        className="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row gap-5 p-5 items-center sm:items-start transition-all duration-300"
                    >
                        <div className="relative w-full sm:w-44 aspect-square rounded-xl overflow-hidden border border-gray-200">
                            <Image src={grocery.image} alt={grocery.name} fill />
                        </div>
                        <div className="flex-1 flex flex-col gap-2 justify-between w-full">
                            <div>
                                <h1 className="text-lg font-semibold text-gray-800 truncate">{grocery.name}</h1>
                                <p className="text-sm text-gray-500 capitalize">{grocery.category}</p>
                            </div>
                            <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <p className="text-lg text-green-700 font-semibold">{grocery.price}/ <span className="text-sm text-gray-500 font-medium ">{grocery.unit}</span></p>
                                <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer" onClick={()=>setEditing(grocery)}><Pencil size={15}/>Edit</button>
                            </div>
                        </div>

                    </motion.div>
                ))}
            </div>
            <AnimatePresence>
                {editing && (
                    <motion.div
                    initial={{opacity:0}}
                    animate={{opacity:1}}
                    exit={{opacity:0}}
                    className="flex insert-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4"
                    >
                        <motion.div
                        initial={{opacity:0,y:20}}
                        animate={{opacity:1,y:0}}
                        transition={{duration:0.5}}
                        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-green-700">Edit Grocery</h2>
                                <button className="text-gray-500 hover:text-gray-700" onClick={()=>setEditing(null)}><X size={20}/></button>
                            </div>

                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ViewGrocery