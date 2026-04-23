"use client"
import { ArrowLeft, Building, CreditCardIcon, Home, Loader2, LocateFixed, MapPin, Navigation, Phone, Search, Truck, User, Wallet } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "motion/react"
import { useSelector } from "react-redux"
import { RootState } from "@/src/redux/store"
import { useEffect, useState } from "react"
import axios from "axios"
import dynamic from "next/dynamic"
import { useSession } from "next-auth/react"
const CheckoutMap = dynamic(() => import('@/src/Components/CheckoutMap'), {ssr: false})


function Checkout() {
    const router = useRouter()
    const { status } = useSession()
    
    const [searchQuery, setSearchQuery] = useState("")
    const { userData } = useSelector((state: RootState) => state.user)
    const { subTotal, deliveryFee, finalTotal, cartData } = useSelector((state: RootState) => state.cart)
    const [loading, setLoading] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod")
    const [address, setAddress] = useState({
        fullname: "",
        mobile: "",
        city: "",
        state: "",
        pincode: "",
        fullAddress: ""
    })

    const [position, setPosition] = useState<[number, number] | null>(null)

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                const { latitude, longitude } = pos.coords
                setPosition([latitude, longitude])

            }, (err) => {
                console.log(err)
            }, {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            })
        }
    }, [])

    useEffect(() => {
        if (userData) {
            setAddress(prev => ({
                ...prev,
                fullname: userData.name || "",
                mobile: userData.mobile || ""
            }))
        }
    }, [userData])

    

    const handleSearch = async () => {
        setLoading(true)
        const {OpenStreetMapProvider} = await import("leaflet-geosearch")
        const provider = new OpenStreetMapProvider()
        const results = await provider.search({ query: searchQuery })
        if (results) {
            setPosition([results[0].y, results[0].x])
        }
        setLoading(false)
    }

    const handleCod = async () => {
        setLoading(true)
        try {
            const result = await axios.post("/api/user/order", {
                userId: userData?._id,
                items: cartData.map(item => ({
                    grocery: item._id,
                    name: item.name,
                    price: item.price,
                    unit: item.unit,
                    image: item.image,
                    quantity: item.quantity
                })),
                paymentMethod,
                totalAmount: finalTotal,
                address: {
                    fullName: address.fullname,
                    mobile: address.mobile,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    fulladdress: address.fullAddress,
                    longitude: position?.[1],
                    latitude: position?.[0]
                }
            })
            console.log(result.data)
            router.push("/user/order-success")
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const handlePayment = async () => {
        setLoading(true)
        try {
            const result = await axios.post("/api/user/payment", {
                userId: userData?._id,
                items: cartData.map(item => ({
                    grocery: item._id,
                    name: item.name,
                    price: item.price,
                    unit: item.unit,
                    image: item.image,
                    quantity: item.quantity
                })),
                paymentMethod,
                totalAmount: finalTotal,
                address: {
                    fullName: address.fullname,
                    mobile: address.mobile,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode,
                    fulladdress: address.fullAddress,
                    longitude: position?.[1],
                    latitude: position?.[0]
                }
            })
            window.location.href = result.data.url
        } catch (error) {
            console.log(error)
        }
        setLoading(false)
    }

    const handleCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setPosition([position.coords.latitude, position.coords.longitude])
            })
        }
    }
    useEffect(() => {
        const fetchAddress = async () => {
            if (!position) return
            try {
                const result = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position[0]}&lon=${position[1]}`)
                console.log(result.data)
                setAddress(prev => ({
                    ...prev,
                    city: result.data.address.city || "",
                    state: result.data.address.state || "",
                    pincode: result.data.address.postcode || "",
                    fullAddress: result.data.display_name || ""
                }))
            } catch (error) {
                console.log(error)
            }
        }
        fetchAddress()
    }, [position])

    return (
        <div className="w-[92%] sm:w-[88%] md:w-[80%] mx-auto py-10 relative">
            <Link href="/user/cart" className="text-green-600 hover:text-green-700 font-semibold flex items-center gap-2"><ArrowLeft /> Back to Cart</Link>
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mt-6 text-center mb-10 "
            >
                Checkout
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2"><MapPin className="text-green-600" /> Delivery Address</h2>
                    <div className="space-y-4">
                        <div className="relative">
                            <User className="absolute left-3 top-3 text-green-600" size={18} />
                            <input type="text" value={address.fullname} onChange={(e) => setAddress({ ...address, fullname: e.target.value })} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                        </div>
                        <div className="relative">
                            <Phone className="absolute left-3 top-3 text-green-600" size={18} />
                            <input type="text" value={address.mobile} onChange={(e) => setAddress({ ...address, mobile: e.target.value })} className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                        </div>
                        <div className="relative">
                            <Home className="absolute left-3 top-3 text-green-600" size={18} />
                            <input type="text" value={address.fullAddress} onChange={(e) => setAddress({ ...address, fullAddress: e.target.value })} placeholder="Full Address" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="relative">
                                <Building className="absolute left-3 top-3 text-green-600" size={18} />
                                <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} placeholder="City" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>

                            <div className="relative">
                                <Navigation className="absolute left-3 top-3 text-green-600" size={18} />
                                <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} placeholder="State" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-3 text-green-600" size={18} />
                                <input type="text" value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} placeholder="Pincode" className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" />
                            </div>


                        </div>

                        <div className="flex gap-2 mt-3">
                            <input type="text" placeholder="Search city or area..." className="flex-1 border rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors" onClick={handleSearch} disabled={loading}>{loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}</button>
                        </div>

                        <div className="relative mt-6 h-82.5 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                            {position &&
                                <CheckoutMap position={position} setPosition={setPosition} />
                            }
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                className="absolute bottom-4 right-4 bg-green-600 text-white p-3 rounded-full hover:bg-green-700 transition-all flex items-center justify-center z-999" onClick={handleCurrentLocation}
                            >
                                <LocateFixed className="w-12 h-12 text-white" />
                            </motion.button>

                        </div>
                    </div>

                </motion.div>
                <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 h-fit"
                >
                    <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2"><Wallet className="text-green-600" /> Payment Method</h2>
                    <div className="space-y-4 mb-6">
                        <button onClick={() => setPaymentMethod("online")} className={`flex items-center gap-2 p-3 rounded-lg border w-full transition-all ${paymentMethod === "online" ? "border-green-500 bg-green-50 shadow-sm" : "hover:bg-gray-200"}`}><CreditCardIcon /><span>Pay Online (stripe)</span></button>
                        <button onClick={() => setPaymentMethod("cod")} className={`flex items-center gap-2 p-3 rounded-lg border w-full transition-all ${paymentMethod === "cod" ? "border-green-500 bg-green-50 shadow-sm" : "hover:bg-gray-200"}`}><Truck /><span>Cash on Delivery</span></button>
                    </div>

                    <div className="border-t pt-4 text-gray-700 space-y-2 text-sm sm:text-base">
                        <div className="flex justify-between">
                            <span className="font-semibold">SubTotal</span>
                            <span className="font-semibold text-green-600">৳{subTotal}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="font-semibold">Delivery Fee</span>
                            <span className="font-semibold text-green-600">৳{deliveryFee}</span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 pt-2">
                            <span className="font-bold ">Total</span>
                            <span className="font-bold text-green-600">৳{finalTotal}</span>
                        </div>
                    </div>
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="w-full bg-green-600 text-white py-3 rounded-full hover:bg-green-700 transition-all font-semibold mt-6" onClick={() => {
                            if (status !== "authenticated") {
                                router.push("/login?callbackUrl=/user/checkout")
                                return
                            }
                            if (paymentMethod == "cod") {
                                handleCod()
                            } else {
                                handlePayment()
                            }
                        }}
                    >
                        {paymentMethod == "cod" ? "Place Order" : "Pay Now"}
                    </motion.button>

                </motion.div>
            </div>
        </div>
    )
}

export default Checkout