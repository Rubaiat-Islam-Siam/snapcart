"use client";

import { ArrowLeft, Loader, PlusCircle, Upload } from "lucide-react";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";

const categories = [
    "Fruits & Vegetables",
            "Dairy & Eggs",
            "Rice, Atta & Grains",
            "Snacks & Biscuits",
            "Spices & Masalas",
            "Beverages & Drinks",
            "Personal Care",
            "Household Essentials",
            "Instant & Packaged Food",
            "Baby & Pet Care"
]

const units = [
    "kg","g","ml","liter","pack","piece"
]

function AddGrocery() {
    const [name,setName] = useState("")
    const [category,setCategory] = useState("")
    const [unit,setUnit] = useState("")
    const [price,setPrice] = useState("")
    const [preview,setPreview] = useState<string | null>()
    const [backendImage,setBackendImage] = useState<File | null>()
    const [loading,setLoading] = useState(false)

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files
        if(!file || file.length === 0) return
        const selectedFile = file[0]
        setBackendImage(selectedFile)
        setPreview(URL.createObjectURL(selectedFile))
      };

      const handleSubmit =async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("name",name)
            formData.append("category",category)
            formData.append("unit",unit)
            formData.append("price",price)
            formData.append("image",backendImage || "")
            const result = await axios.post("/api/admin/add-grocery",formData)
            console.log(result.data)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
        
      }

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-green-50 to to-white py-16 px-4 relative"> 
            <Link href={"/"} className="absolute top-6 left-6 flex items-center gap-2 text-green-700 font-semibold bg-white px-4 py-2 rounded-full shadow-md hover:bg-green-100 hover:shadow-lg transition-all">
                <ArrowLeft className="w-5 h-5"/>
                <span className="hidden md:flex">Back to Home</span>
            </Link>
            
            <motion.div
            initial={{opacity:0,y:20}}
            animate={{opacity:1,y:0}}
            transition={{type:"spring",stiffness:100,damping:14}}
            className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-6 border border-green-200"
            >
                <div className="flex flex-col items-center gap-2 mb-6">
                    <div className="flex items-center gap-3">
                        <PlusCircle className="w-8 h-8 text-green-600"/>
                        <h1 className="font-semibold text-2xl">Add New Grocery</h1>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 text-center" >Fill Out the details below to add a new grocery</p>
                </div>

                <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                            Grocery Name
                            <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="name" id="name" className="w-full p-2 border border-green-200 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition-all" placeholder="eg. sweets,milks..."
                        onChange={(e)=>setName(e.target.value)} value={name} />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div >
                            <label className="block text-gray-700 font-medium mb-1">Category <span className="text-red-500">*</span></label>
                            <select name="category" id="category" className="w-full p-2 border border-green-200 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white" onChange={(e)=>setCategory(e.target.value)} value={category}>
                                <option value="">Select Category</option>
                                {
                                    categories.map((item,index)=>(
                                        <option key={index} value={item}>{item}</option>
                                    ))
                                }
                            </select>
                        </div>

                        <div >
                            <label className="block text-gray-700 font-medium mb-1">Unit <span className="text-red-500">*</span></label>
                            <select name="unit" id="unit" className="w-full p-2 border border-green-200 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition-all bg-white"  onChange={(e)=>setUnit(e.target.value)} value={unit}>
                                <option value="">Select Unit</option>
                                {
                                    units.map((item,index)=>(
                                        <option key={index} value={item}>{item}</option>
                                    ))
                                }
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
                            Price
                            <span className="text-red-500">*</span>
                        </label>
                        <input type="text" name="price" id="price" className="w-full p-2 border border-green-200 rounded-md outline-none focus:ring-2 focus:ring-green-400 transition-all" placeholder="eg. 120" onChange={(e)=>setPrice(e.target.value)} value={price}/>
                    </div>

                    <div>
                        <label htmlFor="image" className="cursor-pointer flex items-center justify-center gap-2 bg-green-50 text-green-700 font-semibold border border-green-200 rounded-xl px-6 py-3 hover:bg-green-100 hover:shadow-lg transition-all w-full sm:w-auto">
                            <Upload className="w-5 h-5"/>
                            Upload Image
                        </label>
                        <input type="file" accept="image/*" name="image" id="image" hidden onChange={handleChangeImage} />
                        {
                            preview && (
                                <div className="mt-2">
                                    <Image src={preview} width={200} height={200} alt="Preview" className="w-full max-h-40 object-contain" />
                                </div>
                            )
                        }
                    </div>

                    <motion.button
                    whileHover={{scale:1.02}}
                    whileTap={{scale:0.9}}
                    disabled={loading}
                    className="mt-4 w-full bg-linear-to-r from-green-500 to-green-700 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-4 shadow-lg hover:shadow-xl transition-all disabled:opacity-60"
                    >
                    {loading? <Loader className="w-5 h-5 animate-spin"/>:`Add Grocery`}
                        
                    </motion.button>

                </form>
            </motion.div>
        </div>
    );
}

export default AddGrocery;