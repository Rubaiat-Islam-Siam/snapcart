"use client"
import axios from "axios"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "motion/react"
import { ArrowLeft, Loader2, Package, Pencil, Search, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { IGrocery } from "@/src/models/grocery.model"
import Image from "next/image"

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
    "kg", "g", "ml", "liter", "pack", "piece"
]

function ViewGrocery() {
    const [groceries, setGroceries] = useState<IGrocery[]>([])
    const [editing, setEditing] = useState<IGrocery | null>(null)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const [backendImage, setBackendImage] = useState<Blob | null>(null)
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [search,setSearch] = useState("")
    const [filter,setFilter] = useState<IGrocery[]>([])
    const router = useRouter()
    useEffect(() => {
        const getGrocery = async () => {
            try {
                const res = await axios.get("/api/admin/get-grocery")
                setGroceries(res.data.groceries)
                setFilter(res.data.groceries)
            } catch (error) {
                console.log(error)
            }
        }
        getGrocery()
    }, [])

    useEffect(() => {
        if (search.trim() === "") {
            setFilter(groceries)
        } else {
            const q = search.toLowerCase()
            setFilter(groceries.filter((g) => 
                g.name.toLowerCase().includes(q) || 
                g.category.toLowerCase().includes(q)
            ))
        }
    }, [search, groceries])

    useEffect(() => {
        if (editing) {
            setPreviewImage(editing.image)
        }
    }, [editing])
    const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setBackendImage(file)
            setPreviewImage(URL.createObjectURL(file))
        }
    }

    const handleEdit = async () => {
        setLoading(true)
        if (!editing) return
        try {
            const formData = new FormData()
            formData.append("groceryId", editing?._id?.toString() || "")
            formData.append("name", editing?.name || "")
            formData.append("category", editing?.category || "")
            formData.append("price", editing?.price || "")
            formData.append("unit", editing?.unit || "")
            formData.append("image", backendImage || "")
            await axios.post("/api/admin/edit-grocery", formData)
            window.location.reload()
        } catch (error) {
            console.log(error)
        }finally{
            setLoading(false)
        }
    }

    const handleDelete = async () => {
        setDeleteLoading(true)
        if (!editing) return
        try {
            
            await axios.post("/api/admin/delete-grocery", {groceryId:editing?._id?.toString() || ""})
            window.location.reload()
        } catch (error) {
            console.log(error)
        }finally{
            setDeleteLoading(false)
        }
    }

    return (
  <div className="pt-10 w-[95%] md:w-[85%] mx-auto pb-24">

    {/* HEADER */}
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10"
    >
      <button
        className="flex items-center gap-2 bg-green-100 hover:bg-green-200 text-green-700 font-semibold rounded-full px-5 py-2 transition-all shadow-sm"
        onClick={() => router.push("/")}
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-3xl md:text-4xl font-extrabold text-green-700 flex items-center gap-3">
        <Package size={30} />
        Manage Groceries
      </h1>
    </motion.div>

    {/* SEARCH */}
    <motion.div
      initial={{ opacity: 0, y: 80 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center gap-3 bg-white border border-gray-200 rounded-full px-6 py-3 shadow-sm mb-12 hover:shadow-md transition-all max-w-xl mx-auto"
    >
      <Search className="w-5 h-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search by Name or Category..."
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className="outline-none w-full text-gray-700 placeholder-gray-400 bg-transparent"
      />
    </motion.div>

    {/* GROCERY LIST */}
    <div className="space-y-6">
      {filter.map((grocery, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="bg-white rounded-3xl shadow-sm hover:shadow-xl border border-gray-100 flex flex-col sm:flex-row gap-6 p-6 items-center sm:items-start transition-all duration-300"
        >
          {/* IMAGE */}
          <div className="relative w-full sm:w-40 aspect-square rounded-2xl overflow-hidden border border-gray-200">
            <Image
              src={grocery.image}
              alt={grocery.name}
              fill
              className="object-cover"
            />
          </div>

          {/* CONTENT */}
          <div className="flex-1 flex flex-col justify-between w-full">
            <div>
              <h2 className="text-xl font-bold text-gray-800 truncate">
                {grocery.name}
              </h2>
              <p className="text-sm text-gray-500 capitalize mt-1">
                {grocery.category}
              </p>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xl text-green-700 font-bold">
                ৳ {Number(grocery.price).toLocaleString("en-BD")}{" "}
                <span className="text-sm text-gray-500 font-medium">
                  / {grocery.unit}
                </span>
              </p>

              <button
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl font-semibold shadow-md transition-all"
                onClick={() => setEditing(grocery)}
              >
                <Pencil size={16} />
                Edit
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
            <AnimatePresence>
                {editing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm px-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-semibold text-green-700">Edit Grocery</h2>
                                <button className="text-gray-500 hover:text-gray-700" onClick={() => setEditing(null)}><X size={20} /></button>
                            </div>
                            <div className="relative aspect-square w-full rounded-lg overflow-hidden mb-4 border border-gray-200 group">
                                {previewImage &&
                                    <Image src={previewImage} alt={editing.name} fill className="object-cover" />
                                }
                                <label htmlFor="imageUpload" className="absolute inset-0 bg-black/40 opacity-0.3 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity"><Upload size={28} className="text-green-600"/></label>
                                <input type="file" id="imageUpload" accept="image/*" hidden onChange={handleImage} />
                            </div>
                            <div className="space-y-4">
                                <input type="text"
                                    placeholder="Name"
                                    value={editing.name}
                                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                                    className="outline-none w-full text-gray-700 placeholder-gray-400 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />

                                <select
                                    value={editing.category}
                                    onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                                    className="outline-none w-full text-gray-700 placeholder-gray-400 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((category, index) => (
                                        <option key={index} value={category}>{category}</option>
                                    ))}
                                </select>

                                <input type="number"
                                    placeholder="Price"
                                    value={editing.price}
                                    onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                                    className="outline-none w-full text-gray-700 placeholder-gray-400 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500" />

                                <select
                                    value={editing.unit}
                                    onChange={(e) => setEditing({ ...editing, unit: e.target.value })}
                                    className="outline-none w-full text-gray-700 placeholder-gray-400 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">Select Unit</option>
                                    {units.map((unit, index) => (
                                        <option key={index} value={unit}>{unit}</option>
                                    ))}
                                </select>

                            </div>
                            <div className="flex justify-end mt-6 gap-2">
                                <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-green-700" onClick={handleEdit}>{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Edit Grocery"}</button>
                                <button className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold cursor-pointer hover:bg-red-700" onClick={handleDelete}>{deleteLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Delete Grocery"}</button>
                            </div>

                        </motion.div>

                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default ViewGrocery