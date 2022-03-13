import { useCallback, useEffect, useState } from "react"
import { theme } from "../state"
import { ThemeSubscription } from "../state/index.types"

export const useTheme = (subscription: ThemeSubscription) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        theme.subscribe(subscription, trigger)

        return () => {
            theme.unsubscribe(subscription, trigger)
        }
    }, [subscription, trigger])

    return theme.getState()
}
