import mongoose from "mongoose"
import { IUser } from "./user.model"

export interface IMessage {
    _id?: mongoose.Types.ObjectId
    roomId: mongoose.Types.ObjectId
    senderId: mongoose.Types.ObjectId | IUser
    text: string
    time: string
    createdAt?: Date
    updatedAt?: Date
}

const messageSchema = new mongoose.Schema<IMessage>({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ChatRoom"
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    text: {
        type: String,
    },
    time: {
        type: String,
    }
}, { timestamps: true })

const Message = mongoose.models.Message || mongoose.model("Message", messageSchema)

export default Message