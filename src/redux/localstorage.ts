import localforage from "localforage"
import * as boardState from "./board/state"
import * as drawingState from "./drawing/state"
import { ReducerState } from "./reducer"
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
    ...states: ReducerState[]
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
    rootState: Record<ReducerState, object>,
    ...states: ReducerState[]
): void {
    states.forEach((name) => {
        debounce(name, () => {
            const state: SerializableState<object, object> = rootState[name]
            localforage.setItem(`${namespace}_${name}`, state.serialize?.())
        })
    })
}

export async function loadLocalStorage(
    ...states: ReducerState[]
): Promise<Partial<RootState>> {
    const state = {} as Record<ReducerState, object | undefined>
    const res = states.map(async (name) => {
        try {
            const val = localStorage.getItem(`${namespace}_${name}`)
            if (val) {
                state[name] = await newState(name)?.deserialize?.(
                    JSON.parse(val)
                )
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error(err)
        }
    })
    await Promise.all(res)

    return state as RootState
}

export async function loadIndexedDB(
    ...states: ReducerState[]
): Promise<Partial<RootState>> {
    const state = {} as Record<ReducerState, object | undefined>
    const res = states.map(async (name) => {
        try {
            const val = await localforage.getItem(`${namespace}_${name}`)
            if (val) {
                state[name] = await newState(name)?.deserialize?.(val as object)
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            // console.error(err) // debugging
        }
    })
    await Promise.all(res)

    return state as RootState
}

function debounce(stateName: ReducerState, callback: () => void): void {
    if (debounceTimeout[stateName]) {
        clearTimeout(debounceTimeout[stateName])
    }

    // Save to LocalStorage after the debounce period has elapsed
    debounceTimeout[stateName] = setTimeout(() => {
        callback()
    }, debounceTime)
}

export function newState(
    stateName: ReducerState
): SerializableState<object, object> | undefined {
    switch (stateName) {
        case "board":
            return boardState.newState() as SerializableState<object, object>

        case "drawing":
            return drawingState.newState() as SerializableState<object, object>

        default:
            return undefined
    }
}
