"use client"

import { useEffect } from "react"
import axios from "axios"
import { useDispatch } from "react-redux"
import { setUserData } from "../redux/userSlice"
import { AppDispatch } from "../redux/store"


function useGetME() {
    const dispatch = useDispatch<AppDispatch>()
    useEffect(() => {
        const getMe = async () => {
            try {
                const res = await axios.get("/api/me")
                dispatch(setUserData(res.data.user))
            }
            catch (error) {
                console.log(error)
            }
        }
        getMe()
    }, [dispatch])
}

export default useGetME
