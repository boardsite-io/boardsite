import { useCallback, useEffect, useState } from "react"
import { online } from "../state"

export const useOnline = () => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        online.subscribe("session", trigger)

        return () => {
            online.unsubscribe("session", trigger)
        }
    }, [])

    return online.getState()
}
