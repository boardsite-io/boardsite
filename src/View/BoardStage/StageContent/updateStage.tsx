import React, { memo } from "react"
import { useCustomSelector } from "hooks"
import { Stage } from "konva/lib/Stage"
import store from "redux/store"

interface UpdateStageProps {
    stageRef: React.RefObject<Stage>
}

export const UpdateStage = memo<UpdateStageProps>(({ stageRef }): null => {
    useCustomSelector((state) => state.board.stage.renderTrigger)
    stageRef.current?.setAttrs(store.getState().board.stage.attrs)
    return null
})
