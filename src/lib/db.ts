import mongoose from "mongoose";

const mongoURL = process.env.MONGO_URL

if(!mongoURL)
    throw new Error ("DB Error")

let cached = global.mongoose

if(!cached)
    cached = global.mongoose ={conn:null,promise:null}
const connectDb = async () => {
    if(cached.conn)
        return cached.conn

    if(!cached.promise){
        cached.promise = mongoose.connect(mongoURL).then((conn)=> conn.connection)
    }
    try {
        const conn = await cached.promise
        return conn
    } catch (error) {
        console.log(error)
    }
}

export default connectDb