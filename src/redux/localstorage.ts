import localforage from "localforage"
import * as boardState from "./board/state"
import * as drawingState from "./drawing/state"
import { RootState, SerializableState } from "./types"

const debounceTime = 1000
const namespace = "boardsite"
const debounceTimeout: { [name: string]: NodeJS.Timeout } = {}

localforage.config({
    name: namespace,
    driver: localforage.INDEXEDDB,
})

export function saveLocalStore(
    rootState: { [name: string]: object },
    ...states: string[]
): void {
    states.forEach((name) => {
        debounce(name, () => {
            const serializableState = rootState[name] as SerializableState
            localStorage.setItem(
                `${namespace}_${name}`,
                JSON.stringify(serializableState.serialize?.())
            )
        })
    })
}

export function saveIndexedDB(
    rootState: { [name: string]: object },
    ...states: string[]
): void {
    states.forEach((name) => {
        debounce(name, () => {
            const serializableState = rootState[name] as SerializableState
            localforage.setItem(
                `${namespace}_${name}`,
                serializableState.serialize?.()
            )
        })
    })
}

export function loadLocalStorage(...states: string[]): RootState {
    const state: { [name: string]: object | undefined } = {}
    states.forEach((name) => {
        try {
            const val = localStorage.getItem(`${namespace}_${name}`)
            if (val) {
                state[name] = newState(name)?.deserialize?.(JSON.parse(val))
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    })
    return state as RootState
}

export async function loadIndexedDB(...states: string[]): Promise<RootState> {
    const state: { [name: string]: object | undefined } = {}
    const res = states.map(async (name) => {
        try {
            const val = await localforage.getItem(`${namespace}_${name}`)
            if (val) {
                state[name] = newState(name)?.deserialize?.(val as object)
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

function newState(stateName: string): SerializableState | undefined {
    switch (stateName) {
        case "board":
            return boardState.newState()

        case "drawing":
            return drawingState.newState()

        default:
            return undefined
    }
}
