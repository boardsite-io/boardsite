import { useCallback, useEffect, useState } from "react"
import { notification } from "../state"

export const useNotification = () => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        notification.subscribe(trigger)

        return () => {
            notification.unsubscribe(trigger)
        }
    }, [])

    return notification.getState()
}
