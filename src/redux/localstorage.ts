import * as boardState from "./board/state"
import * as drawingState from "./drawing/state"
import { isConnectedState } from "./session/helpers"
import { WebControlState } from "./session/session"
import { RootState, SerializableState } from "./types"

const debounce = 1000
const states = ["board", "drawing"]
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
    const state: { [name: string]: object | undefined } = {}
    states.forEach((name) => {
        try {
            const val = localStorage.getItem(`${namespace}_${name}`)
            if (val) {
                switch (name) {
                    case "board":
                        state[name] = boardState.newState().deserialize?.(val)
                        break

                    case "drawing":
                        state[name] = drawingState.newState().deserialize?.(val)
                        break

                    default:
                        break
                }
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    })

    return state as RootState
}

function saveState(state: { [name: string]: object }) {
    states.forEach((name) => {
        // dont store board state in sessions
        if (
            !(
                isConnectedState(state.session as WebControlState) &&
                name === "board"
            )
        ) {
            const serializableState = state[name] as SerializableState
            localStorage.setItem(
                `${namespace}_${name}`,
                serializableState.serialize()
            )
        }
    })
}
