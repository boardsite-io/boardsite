import { useCallback, useEffect, useState } from "react"
import { notification } from "../state"

export const useNotification = () => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        notification.subscribe(trigger, "notification")

        return () => {
            notification.unsubscribe(trigger, "notification")
        }
    }, [])

    return notification.getState()
}
