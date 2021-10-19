import React from "react"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"
import { pageSize, sizePreset } from "consts"
import { SET_PAGE_SIZE } from "redux/board/board"
import { A4Landscape, A4Portrait, SizePresets } from "./size.styled"

const Size: React.FC = () => {
    const size = useCustomSelector((state) => state.board.pageSettings.size)
    return (
        <SizePresets>
            <A4Landscape
                type="button"
                $active={size === pageSize[sizePreset.A4_LANDSCAPE]}
                onClick={() => {
                    store.dispatch(
                        SET_PAGE_SIZE(pageSize[sizePreset.A4_LANDSCAPE])
                    )
                }}
            />
            <A4Portrait
                type="button"
                $active={size === pageSize[sizePreset.A4_PORTRAIT]}
                onClick={() =>
                    store.dispatch(
                        SET_PAGE_SIZE(pageSize[sizePreset.A4_PORTRAIT])
                    )
                }
            />
        </SizePresets>
    )
}
export default Size
