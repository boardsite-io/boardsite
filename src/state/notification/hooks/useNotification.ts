import { useCallback, useEffect, useState } from "react"
import { notification } from "../state"

export const useNotification = () => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        notification.subscribe("notification", trigger)

        return () => {
            notification.unsubscribe("notification", trigger)
        }
    }, [])

    return notification.getState()
}
