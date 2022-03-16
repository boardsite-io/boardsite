import { FormattedMessage } from "language"
import React, { useCallback } from "react"
import { pageSize } from "consts"
import { Position, ToolTip } from "components"
import { drawing } from "state/drawing"
import { PageSize } from "state/board/state/index.types"
import { useGState } from "state"
import {
    A4Landscape,
    A4Portrait,
    SizePresetLabel,
    SizePresets,
} from "./index.styled"

const Size: React.FC = () => {
    const { width, height } = useGState("PageSizeMenu").drawing.pageMeta.size

    const isMatch = useCallback(
        (size: PageSize) => width === size.width && height === size.height,
        [width, height]
    )

    return (
        <SizePresets>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolTip.PageSize.A4Portrait" />}
            >
                <SizePresetLabel htmlFor="a4-portrait">
                    <A4Portrait
                        type="button"
                        id="a4-portrait"
                        $active={isMatch(pageSize.a4portrait)}
                        onClick={() => {
                            drawing.setPageSize(pageSize.a4portrait)
                        }}
                    />
                </SizePresetLabel>
            </ToolTip>
            <ToolTip
                position={Position.Bottom}
                text={<FormattedMessage id="ToolTip.PageSize.A4Landscape" />}
            >
                <SizePresetLabel htmlFor="a4-landscape">
                    <A4Landscape
                        type="button"
                        id="a4-landscape"
                        $active={isMatch(pageSize.a4landscape)}
                        onClick={() => {
                            drawing.setPageSize(pageSize.a4landscape)
                        }}
                    />
                </SizePresetLabel>
            </ToolTip>
        </SizePresets>
    )
}
export default Size
