import React, { useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { online } from "state/online"
import { notification } from "state/notification"

const Callback: React.FC = () => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    useEffect(() => {
        if (error || !token || searchParams.get("token_type") !== "bearer") {
            notification.create("Notification.Session.OauthFlowFailed")
            navigate("/")
            return
        }
        online.setToken(token).then(() => {
            navigate("/")
        })
    })

    return null
}

export default Callback
