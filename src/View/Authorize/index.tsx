import React, { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { online } from "../../state/online"
import { currentSession } from "../../api/session"

const Callback: React.FC = () => {
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")

    if (token && searchParams.get("token_type") === "bearer") {
        currentSession()
            .setToken(token)
            .then((isAuthorized) => {
                online.setToken(token, isAuthorized)
            })
    }

    const navigate = useNavigate()
    useEffect(() => {
        navigate("/")
    })

    return null
}

export default Callback
