import { Attachment, AttachType } from "redux/board/board.types"
import { PDFAttachment } from "./pdf"

/**
 * creates a new Attachment instance from a serialized one
 */
export const newAttachment = (
    attachment: Pick<Attachment, "id" | "type" | "cachedBlob">
): Attachment => {
    switch (attachment.type) {
        case AttachType.PDF:
            return new PDFAttachment(attachment.cachedBlob).setId(attachment.id)

        default:
            throw new Error("unknown attachment type")
    }
}
