import * as boardState from "./board/serialize"
import * as drawingState from "./drawing/serialize"
import { RootState } from "./types"

const debounce = 1000
const namespace = "boardsite"
let debounceTimeout: NodeJS.Timeout

export const save = (state: RootState): void => {
    if (debounceTimeout) {
        clearTimeout(debounceTimeout)
    }

    // Save to LocalStorage after the debounce period has elapsed
    debounceTimeout = setTimeout(() => {
        saveState(state)
    }, debounce)
}

export const load = (): RootState => {
    const state = {} as RootState
    try {
        const val = localStorage.getItem(`${namespace}_board`)
        if (val) {
            state.board = boardState.deserialize(val)
        }
    } catch (err) {
        console.log(err)
    }

    try {
        const val = localStorage.getItem(`${namespace}_drawing`)
        if (val) {
            state.drawing = drawingState.deserialize(val)
        }
    } catch (err) {
        console.log(err)
    }

    return state
}

function saveState(state: RootState) {
    localStorage.setItem(
        `${namespace}_board`,
        boardState.serialize(state.board)
    )

    localStorage.setItem(
        `${namespace}_drawing`,
        drawingState.serialize(state.drawing)
    )
}
