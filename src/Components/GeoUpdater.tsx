"use client"
import { useEffect } from "react"
import { getSocket } from "../lib/socket"

function GeoUpdater({userId}: {userId:string}) {
    let socket = getSocket()
    socket.emit("identity",userId)
    useEffect(()=> {
        if(!userId) return 
        if(!navigator.geolocation) return 
        const watcher = navigator.geolocation.watchPosition((position)=> {
            const lat = position.coords.latitude
            const lng = position.coords.longitude
            socket.emit("update-location",{
                userId,
                latitude:lat,
                longitude:lng
            })
        }, (error)=> {
            console.log(error)
        },{
            enableHighAccuracy:true
        })
        return () => navigator.geolocation.clearWatch(watcher)
    },[])

    return null
}

export default GeoUpdater