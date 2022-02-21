import React, { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { online } from "state/online"

const Callback: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    useEffect(() => {
        if (token && searchParams.get("token_type") === "bearer") {
            online.setToken(token).then(() => {
                navigate("/")
            })
        }
    })

    return null
}

export default Callback
