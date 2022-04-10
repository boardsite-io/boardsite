import {
    Attachment,
    AttachType,
    SerializedAttachment,
} from "state/board/state/index.types"
import { PDFAttachment } from "./pdf"

/**
 * creates a new Attachment instance from a serialized one
 */
export const newAttachment = ({
    type,
    id,
    cachedBlob,
}: SerializedAttachment): Attachment => {
    switch (type) {
        case AttachType.PDF:
            return new PDFAttachment(cachedBlob).setId(id)

        default:
            throw new Error("unknown attachment type")
    }
}
