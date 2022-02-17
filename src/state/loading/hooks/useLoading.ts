import { useCallback, useEffect, useState } from "react"
import { loading } from "../state"

export const useLoading = () => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        loading.subscribe(trigger, "loading")

        return () => {
            loading.unsubscribe(trigger, "loading")
        }
    }, [])

    return loading.getState()
}
