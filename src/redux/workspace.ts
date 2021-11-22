import download from "downloadjs"
import { deflate } from "pako"
import { BoardState } from "./board/board.types"

const fileVersion = "1.0"
const fileExt = ".boardio"
const statesToSave = ["board"]

const createFileHeader = (version: string, states: string[]): Uint8Array => {
    const header = {
        version,
        states,
    }
    return deflate(JSON.stringify(header))
}

const toUint32 = (x: number): Uint8Array => {
    const buf = new ArrayBuffer(4)
    new DataView(buf).setUint32(0, x, true)
    return new Uint8Array(buf)
}

/**
 * Concats multiple array buffers and prefixes 4 byte to each segment, representing the length of the segment
 * @param arrs
 * @returns
 */
const concatFileSegments = (...segments: Uint8Array[]): Uint8Array => {
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

export const saveWorkspace = (filename: string, state: BoardState): void => {
    const s = state.serialize?.()
    const header = createFileHeader(fileVersion, statesToSave)
    const body = deflate(JSON.stringify(s))

    const content = concatFileSegments(header, body)

    download(content, `${filename}${fileExt}`)
}
