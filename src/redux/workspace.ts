import { deflate, inflate } from "pako"
import { newState } from "./localstorage"
import { ReducerState } from "./reducer"
import {
    FileHeader,
    RootState,
    SerializableStateRecord,
    SerializableReducerState,
} from "./types"

const fileVersion = "1.0"
const statesToSave: SerializableReducerState[] = ["board"]

export function saveWorkspace(rootState: SerializableStateRecord): Uint8Array {
    const header = createFileHeader(fileVersion, statesToSave)
    const body = statesToSave.map((name) =>
        deflate(JSON.stringify(rootState[name].serialize?.()))
    )
    return concatFileSegments(header, ...body)
}

/**
 * Extracts states from a file. Only those in statesToSave are considered.
 * @param file
 * @returns
 */
export async function loadWorkspace(
    readFile: Uint8Array
): Promise<Partial<RootState>> {
    try {
        const segments = getFileSegments(readFile).map((seg) =>
            JSON.parse(inflate(seg, { to: "string" }))
        )
        const states = verifyFileHeader(segments)
        const state = {} as Record<ReducerState, object | undefined>

        const res = states.map(async (name, i) => {
            // skip unsupported states
            if (name) {
                state[name] = await newState(name)?.deserialize?.(
                    segments[i + 1]
                )
            }
        })
        await Promise.all(res)

        return state as Partial<RootState>
    } catch (err) {
        throw new Error(`loadWorkspace: ${err}`)
    }
}

/**
 * Handles importing workspace files
 * @param file File from file input field
 */
export const handleImportWorkspaceFile = async (
    file: File
): Promise<Partial<RootState>> => {
    const readFile = await readFileAsUint8Array(file)
    const partialRootState = loadWorkspace(readFile)
    return partialRootState
}

export const readFileAsUint8Array = async (file: File): Promise<Uint8Array> =>
    new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
            resolve(new Uint8Array(fileReader.result as ArrayBuffer))
        }
        fileReader.onerror = (err) => {
            reject(err)
        }
        fileReader.readAsArrayBuffer(file)
    })

function createFileHeader(
    version: string,
    states: SerializableReducerState[]
): Uint8Array {
    const header = {
        version,
        states,
    }
    return deflate(JSON.stringify(header))
}

function verifyFileHeader(
    segments: object[]
): (SerializableReducerState | null)[] {
    const { version, states } = segments[0] as FileHeader
    switch (version) {
        case fileVersion:
            // latest version; no preprocessing required
            break

        default:
            throw new Error(
                `cannot read file, unknown or missing version ${version}`
            )
    }
    return states.map((name) =>
        statesToSave.indexOf(name) !== -1 ? name : null
    )
}

function toUint32(x: number): Uint8Array {
    const buf = new ArrayBuffer(4)
    new DataView(buf).setUint32(0, x, true)
    return new Uint8Array(buf)
}

function fromUint32(data: Uint8Array): number {
    let x = 0
    for (let i = 0; i < 4; i++) {
        x += data[i] << (i * 8)
    }
    return x
}

/**
 * Concats multiple array buffers and prefixes 4 byte to each segment, representing the length of the segment
 * @param arrs
 * @returns
 */
function concatFileSegments(...segments: Uint8Array[]): Uint8Array {
    const totalLength =
        segments.reduce((l, cur) => l + cur.length, 0) + 4 * segments.length
    const buf = new Uint8Array(totalLength)
    let offset = 0
    segments.forEach((arr) => {
        buf.set(toUint32(arr.length), offset)
        offset += 4
        buf.set(arr, offset)
        offset += arr.length
    })
    return buf
}

function getFileSegments(data: Uint8Array): Uint8Array[] {
    let offset = 0
    const result: Uint8Array[] = []
    while (offset < data.length) {
        const size = fromUint32(data.slice(offset, offset + 4))
        offset += 4
        const segment = data.slice(offset, offset + size)
        offset += size
        result.push(segment)
    }
    return result
}
