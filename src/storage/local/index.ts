import localforage from "localforage"

const NAMESPACE = "boardsite"

localforage.config({
    name: NAMESPACE,
    driver: [localforage.INDEXEDDB, localforage.LOCALSTORAGE],
})

type StateInLocalStorage = "drawing"

type StateInIndexedDB = "board"

export const saveLocalStorage = (
    name: StateInLocalStorage,
    data: object
): void => {
    try {
        localStorage.setItem(`${NAMESPACE}_${name}`, JSON.stringify(data))
    } catch (error) {}
}

export const saveIndexedDB = async (
    name: StateInIndexedDB,
    data: object
): Promise<void> => {
    try {
        await localforage.setItem(`${NAMESPACE}_${name}`, data)
    } catch (error) {}
}

export const loadLocalStorage = async (
    name: StateInLocalStorage
): Promise<object | null> => {
    try {
        const data = localStorage.getItem(`${NAMESPACE}_${name}`)
        if (data === null) return null

        return JSON.parse(data)
    } catch (error) {
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
        return null
    }
}
