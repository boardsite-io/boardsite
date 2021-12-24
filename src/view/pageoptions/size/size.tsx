import React, { useCallback } from "react"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { pageSize } from "consts"
import { SET_PAGE_SIZE } from "redux/board/board"
import { PageSize } from "redux/board/board.types"
import {
    A4Landscape,
    A4Portrait,
    SizePresetLabel,
    SizePresets,
    Square,
} from "./size.styled"

const Size: React.FC = () => {
    const { width, height } = useCustomSelector(
        (state) => state.board.pageMeta.size
    )

    const isMatch = useCallback(
        (size: PageSize) => width === size.width && height === size.height,
        [width, height]
    )

    return (
        <SizePresets>
            <SizePresetLabel htmlFor="a4-landscape">
                <A4Landscape
                    type="button"
                    id="a4-landscape"
                    $active={isMatch(pageSize.a4landscape)}
                    onClick={() => {
                        store.dispatch(SET_PAGE_SIZE(pageSize.a4landscape))
                    }}
                />
            </SizePresetLabel>
            <SizePresetLabel htmlFor="a4-portrait">
                <A4Portrait
                    type="button"
                    id="a4-portrait"
                    $active={isMatch(pageSize.a4portrait)}
                    onClick={() => {
                        store.dispatch(SET_PAGE_SIZE(pageSize.a4portrait))
                    }}
                />
            </SizePresetLabel>
            <SizePresetLabel htmlFor="square">
                <Square
                    type="button"
                    id="square"
                    $active={isMatch(pageSize.square)}
                    onClick={() => {
                        store.dispatch(SET_PAGE_SIZE(pageSize.square))
                    }}
                />
            </SizePresetLabel>
        </SizePresets>
    )
}
export default Size
