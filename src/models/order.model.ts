import mongoose from "mongoose";
import { IUser } from "./user.model";

export interface IOder {
    _id: mongoose.Types.ObjectId
    user: mongoose.Types.ObjectId | { _id: mongoose.Types.ObjectId; name: string }
    items: [{
        grocery: mongoose.Types.ObjectId
        name: string
        price: string
        unit: string
        image: string
        quantity: number
    }]
    isPaid: boolean
    totalAmount: number
    paymentMethod: "cod" | "online"
    address: {
        fullName: string
        mobile: string
        fulladdress: string
        city: string
        state: string
        pincode: string
        longitude: number
        latitude: number
    }
    deliveryOtp: string | null
    deliveryOtpVerification: boolean
    deliveryAt?: Date
    assignment?: mongoose.Types.ObjectId
    assignedDeliveryBoy?: mongoose.Types.ObjectId | IUser
    status: "pending" | "out of delivery" | "delivered" | "cancelled"
    createdAt?: Date
    updatedAt?: Date
}

const orderSchema = new mongoose.Schema<IOder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    items: [{
        grocery: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Grocery",
            required: true
        },
        name: {
            type: String,
        },
        price: {
            type: String,
        },
        unit: {
            type: String,
        },
        image: {
            type: String,
        },
        quantity: {
            type: Number,
        }
    }],
    totalAmount: {
        type: Number,

    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paymentMethod: {
        type: String,
        enum: ["cod", "online"],
        default: "cod"
    },
    address: {
        name: {
            type: String,
        },
        mobile: {
            type: String,
        },
        fulladdress: {
            type: String,
        },
        city: {
            type: String,
        },
        state: {
            type: String,
        },
        pincode: {
            type: String,
        },
        longitude: {
            type: Number,
        },
        latitude: {
            type: Number,
        }
    },
    status: {
        type: String,
        enum: ["pending", "out of delivery", "delivered", "cancelled"],
        default: "pending"
    },
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "DeliveryAssignment",
        default: null
    },
    assignedDeliveryBoy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    deliveryOtp: {
        type: String,
        default: null
    },
    deliveryOtpVerification: {
        type: Boolean,
        default: false
    },
    deliveryAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

export const Order = mongoose.models.Order || mongoose.model<IOder>("Order", orderSchema)
export default Order