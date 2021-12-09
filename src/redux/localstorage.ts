import localforage from "localforage"
import * as boardState from "./board/state"
import * as drawingState from "./drawing/state"
import { RootState, SerializableState } from "./types"

const debounceTime = 1000
const namespace = "boardsite"
const debounceTimeout: Record<string, NodeJS.Timeout> = {}

localforage.config({
    name: namespace,
    driver: localforage.INDEXEDDB,
})

export function saveLocalStore(
    rootState: Record<string, object>,
    ...states: string[]
): void {
    states.forEach((name) => {
        debounce(name, () => {
            const state: SerializableState<object, object> = rootState[name]
            localStorage.setItem(
                `${namespace}_${name}`,
                JSON.stringify(state.serialize?.())
            )
        })
    })
}

export function saveIndexedDB(
    rootState: Record<string, object>,
    ...states: string[]
): void {
    states.forEach((name) => {
        debounce(name, () => {
            const state: SerializableState<object, Promise<object>> = rootState[
                name
            ]
            localforage.setItem(`${namespace}_${name}`, state.serialize?.())
        })
    })
}

export function loadLocalStorage(...states: string[]): RootState {
    const state: Record<string, object | undefined> = {}
    states.forEach((name) => {
        try {
            const val = localStorage.getItem(`${namespace}_${name}`)
            if (val) {
                state[name] = newState<object, object>(name)?.deserialize?.(
                    JSON.parse(val)
                )
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    })

    return state as RootState
}

export async function loadIndexedDB(...states: string[]): Promise<RootState> {
    const state: Record<string, object | undefined> = {}
    const res = states.map(async (name) => {
        try {
            const val = await localforage.getItem(`${namespace}_${name}`)
            if (val) {
                state[name] = await newState<object, Promise<object>>(
                    name
                )?.deserialize?.(val as object)
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            // console.error(err) // debugging
        }
    })
    await Promise.all(res)

    return state as RootState
}

function debounce(stateName: string, callback: () => void): void {
    if (debounceTimeout[stateName]) {
        clearTimeout(debounceTimeout[stateName])
    }

    // Save to LocalStorage after the debounce period has elapsed
    debounceTimeout[stateName] = setTimeout(() => {
        callback()
    }, debounceTime)
}

function newState<T extends object, U extends object>(
    stateName: string
): SerializableState<T, U> | undefined {
    switch (stateName) {
        case "board":
            return boardState.newState() as SerializableState<T, U>

        case "drawing":
            return drawingState.newState() as SerializableState<T, U>

        default:
            return undefined
    }
}
