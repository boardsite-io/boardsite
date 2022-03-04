import localforage from "localforage"
import { notification } from "state/notification"

const NAMESPACE = "boardsite"
const debounceTime = 500 // ms
const debounceTimeout: Record<string, NodeJS.Timeout> = {}

localforage.config({
    name: NAMESPACE,
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
})

type StateInLocalStorage = "drawing" | "online"

type StateInIndexedDB = "board"

export const saveLocalStorage = (
    name: StateInLocalStorage,
    data: object
): void => {
    debounce(name, () => {
        localStorage.setItem(`${NAMESPACE}_${name}`, JSON.stringify(data))
    })
}

export const saveIndexedDB = (name: StateInIndexedDB, data: object): void => {
    debounce(name, () => {
        localforage.setItem(`${NAMESPACE}_${name}`, data)
    })
}

export const loadLocalStorage = async (
    name: StateInLocalStorage
): Promise<object | null> => {
    try {
        const data = localStorage.getItem(`${NAMESPACE}_${name}`)
        if (data === null) return null

        return JSON.parse(data)
    } catch (error) {
        notification.create("Storage.LoadLocalStorageFailed")
        return null
    }
}

export const loadIndexedDB = async (
    name: StateInIndexedDB
): Promise<object | null> => {
    try {
        const data = await localforage.getItem(`${NAMESPACE}_${name}`)
        if (!data) return null

        return data as object
    } catch (error) {
        notification.create("Storage.LoadIndexedDBFailed")
        return null
    }
}

const debounce = (
    stateName: StateInLocalStorage | StateInIndexedDB,
    callback: () => void
): void => {
    if (debounceTimeout[stateName]) {
        clearTimeout(debounceTimeout[stateName])
    }

    // Save to LocalStorage after the debounce period has elapsed
    debounceTimeout[stateName] = setTimeout(() => {
        callback()
    }, debounceTime)
}
