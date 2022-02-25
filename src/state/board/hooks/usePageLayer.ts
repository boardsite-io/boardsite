import { useCallback, useEffect, useState } from "react"
import { board } from "../state"
import { PageId, PageLayer } from "../state/index.types"

export const usePageLayer = (pageLayer: PageLayer, pageId: PageId) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        board.subscribePage(pageLayer, pageId, trigger)

        return () => {
            board.unsubscribePage(pageLayer, pageId)
        }
    }, [])

    return board.getState()
}
