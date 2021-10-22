import React from "react"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"
import { pageSize, sizePreset } from "consts"
import { SET_PAGE_SIZE } from "redux/board/board"
import {
    A4Landscape,
    A4Portrait,
    SizePresetLabel,
    SizePresets,
    Square,
} from "./size.styled"

const Size: React.FC = () => {
    const size = useCustomSelector((state) => state.board.pageSettings.size)
    return (
        <SizePresets>
            <SizePresetLabel htmlFor="a4-landscape">
                <A4Landscape
                    type="button"
                    id="a4-landscape"
                    $active={size === pageSize[sizePreset.A4_LANDSCAPE]}
                    onClick={() => {
                        store.dispatch(
                            SET_PAGE_SIZE(pageSize[sizePreset.A4_LANDSCAPE])
                        )
                    }}
                />
            </SizePresetLabel>
            <SizePresetLabel htmlFor="a4-portrait">
                <A4Portrait
                    type="button"
                    id="a4-portrait"
                    $active={size === pageSize[sizePreset.A4_PORTRAIT]}
                    onClick={() =>
                        store.dispatch(
                            SET_PAGE_SIZE(pageSize[sizePreset.A4_PORTRAIT])
                        )
                    }
                />
            </SizePresetLabel>
            <SizePresetLabel htmlFor="square">
                <Square
                    type="button"
                    id="square"
                    $active={size === pageSize[sizePreset.Square]}
                    onClick={() =>
                        store.dispatch(
                            SET_PAGE_SIZE(pageSize[sizePreset.Square])
                        )
                    }
                />
            </SizePresetLabel>
        </SizePresets>
    )
}
export default Size
