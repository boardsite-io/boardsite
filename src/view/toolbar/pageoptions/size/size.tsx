import React from "react"
import { useCustomSelector } from "redux/hooks"
import store from "redux/store"
import { pageSize } from "consts"
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
                    $active={size === pageSize.a4landscape}
                    onClick={() => {
                        store.dispatch(SET_PAGE_SIZE(pageSize.a4landscape))
                    }}
                />
            </SizePresetLabel>
            <SizePresetLabel htmlFor="a4-portrait">
                <A4Portrait
                    type="button"
                    id="a4-portrait"
                    $active={size === pageSize.a4portrait}
                    onClick={() =>
                        store.dispatch(SET_PAGE_SIZE(pageSize.a4portrait))
                    }
                />
            </SizePresetLabel>
            <SizePresetLabel htmlFor="square">
                <Square
                    type="button"
                    id="square"
                    $active={size === pageSize.square}
                    onClick={() =>
                        store.dispatch(SET_PAGE_SIZE(pageSize.square))
                    }
                />
            </SizePresetLabel>
        </SizePresets>
    )
}
export default Size
