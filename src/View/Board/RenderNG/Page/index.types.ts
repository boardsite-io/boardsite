import { Page } from "state/board/state/index.types"

export type PageOffset = {
    left: number
    top: number
}

export interface PageProps {
    page: Page
    pageOffset: PageOffset
}
