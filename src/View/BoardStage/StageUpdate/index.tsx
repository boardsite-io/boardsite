import React, { memo } from "react"
import { useCustomSelector } from "hooks"
import { Stage } from "konva/lib/Stage"
import store from "redux/store"

interface StageUpdateProps {
    stageRef: React.RefObject<Stage>
}

const StageUpdate = memo<StageUpdateProps>(({ stageRef }): null => {
    useCustomSelector((state) => state.board.stage.renderTrigger)
    stageRef.current?.setAttrs(store.getState().board.stage.attrs)
    return null
})

export default StageUpdate
