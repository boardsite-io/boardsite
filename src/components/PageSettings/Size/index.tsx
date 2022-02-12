import { FormattedMessage } from "language"
import React, { useCallback } from "react"
import { useCustomSelector } from "hooks"
import store from "redux/store"
import { pageSize } from "consts"
import { SET_PAGE_SIZE } from "redux/drawing"
import { PageSize } from "redux/board/index.types"
import { Position, ToolTip } from "components"
import {
    A4Landscape,
    A4Portrait,
    SizePresetLabel,
    SizePresets,
} from "./index.styled"

const Size: React.FC = () => {
    const { width, height } = useCustomSelector(
        (state) => state.drawing.pageMeta.size
    )

    const isMatch = useCallback(
        (size: PageSize) => width === size.width && height === size.height,
        [width, height]
    )

    return (
        <SizePresets>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="PageSize.A4Portrait" />}
            >
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
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="PageSize.A4Landscape" />}
            >
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
            </ToolTip>
        </SizePresets>
    )
}
export default Size
