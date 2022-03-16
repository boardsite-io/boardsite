import { useCallback, useEffect, useState } from "react"
import { PageId } from "state/board/state/index.types"
import { subscriptionState } from "."
import { board } from "../board/state"
import { PageLayer } from "./index.types"

export const usePageLayer = (pageLayer: PageLayer, pageId: PageId) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        subscriptionState.subscribePage(pageLayer, pageId, trigger)

        return () => {
            subscriptionState.unsubscribePage(pageLayer, pageId)
        }
    }, [pageLayer, pageId, trigger])

    return board.getState()
}
