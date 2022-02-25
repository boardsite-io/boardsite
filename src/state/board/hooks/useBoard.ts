import { useCallback, useEffect, useState } from "react"
import { board } from "../state"
import { BoardSubscriber } from "../state/index.types"

export const useBoard = (subscriber: BoardSubscriber) => {
    const [, render] = useState<object>({})
    const trigger = useCallback(() => render({}), [])

    useEffect(() => {
        board.subscribe(subscriber, trigger)

        return () => {
            board.unsubscribe(subscriber, trigger)
        }
    }, [subscriber, trigger])

    return board.getState()
}
