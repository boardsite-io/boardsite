import { useCallback, useEffect, useState } from "react"
import { menu } from "../state"
import { MenuSubscription } from "../state/index.types"

export const useMenu = (subscription: MenuSubscription) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        menu.subscribe(trigger, subscription)

        return () => {
            menu.unsubscribe(trigger, subscription)
        }
    }, [])

    return menu.getState()
}
