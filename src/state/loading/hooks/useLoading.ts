import { useCallback, useEffect, useState } from "react"
import { loading } from "../state"

export const useLoading = () => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        loading.subscribe("loading", trigger)

        return () => {
            loading.unsubscribe("loading", trigger)
        }
    }, [trigger])

    return loading.getState()
}
