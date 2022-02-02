import { PIXEL_RATIO } from "consts"
import { PageSize } from "redux/board/index.types"

export const getPageSize = (dataURL: string): PageSize => {
    const header = atob(dataURL.split(",")[1].slice(0, 50)).slice(16, 24)
    const uint8 = Uint8Array.from(header, (c) => c.charCodeAt(0))
    const dataView = new DataView(uint8.buffer)

    return {
        width: dataView.getInt32(0) / PIXEL_RATIO,
        height: dataView.getInt32(4) / PIXEL_RATIO,
    }
}
