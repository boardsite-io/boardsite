import { useCallback, useEffect, useState } from "react"
import { menu } from "../state"
import { MenuSubscription } from "../state/index.types"

export const useMenu = (subscription: MenuSubscription) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        menu.subscribe(subscription, trigger)

        return () => {
            menu.unsubscribe(subscription, trigger)
        }
    }, [subscription, trigger])

    return menu.getState()
}
