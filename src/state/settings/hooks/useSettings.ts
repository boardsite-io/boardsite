import { useCallback, useEffect, useState } from "react"
import { settings } from "../state"
import { SettingsSubscription } from "../state/index.types"

export const useSettings = (subscription: SettingsSubscription) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        settings.subscribe(subscription, trigger)

        return () => {
            settings.unsubscribe(subscription, trigger)
        }
    }, [subscription, trigger])

    return settings.getState()
}
