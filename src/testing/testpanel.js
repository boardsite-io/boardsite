import React from "react"
import { useSelector } from "react-redux"
import "./testpanel.css"

import { Button } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"

import overload, { dispatchTest, dispatchTestSingle } from "./stresstest"

export default function TestPanel() {
    const isMouseDown = useSelector((state) => state.drawControl.isMouseDown)
    const isDraggable = useSelector((state) => state.drawControl.isDraggable)
    const isListening = useSelector((state) => state.drawControl.isListening)
    return (
        <>
            <div className="testPanel">
                <Tooltip
                    id="tooltip"
                    title="zoom out"
                    TransitionProps={{ timeout: 0 }}
                    placement="right">
                    <Button id="testPanelButtons">☯ TESTING ☯</Button>
                </Tooltip>
                <Tooltip
                    id="tooltip"
                    title="zoom out"
                    TransitionProps={{ timeout: 0 }}
                    placement="right">
                    <Button id="testPanelButtons" onClick={overload}>
                        Stress Test
                    </Button>
                </Tooltip>
                <Tooltip
                    id="tooltip"
                    title="zoom out"
                    TransitionProps={{ timeout: 0 }}
                    placement="right">
                    <Button id="testPanelButtons" onClick={dispatchTest}>
                        Update All Test
                    </Button>
                </Tooltip>
                <Tooltip
                    id="tooltip"
                    title="zoom out"
                    TransitionProps={{ timeout: 0 }}
                    placement="right">
                    <Button id="testPanelButtons" onClick={dispatchTestSingle}>
                        Update One Test
                    </Button>
                </Tooltip>
            </div>
            <div className="testPanelStates">
                <Button
                    id={
                        isMouseDown
                            ? "testPanelButtonsActive"
                            : "testPanelButtons"
                    }
                    variant="contained">
                    isMouseDown
                </Button>
                <Button
                    id={
                        isDraggable
                            ? "testPanelButtonsActive"
                            : "testPanelButtons"
                    }
                    variant="contained">
                    ISDRAGGABLE
                </Button>
                <Button
                    id={
                        isListening
                            ? "testPanelButtonsActive"
                            : "testPanelButtons"
                    }
                    variant="contained">
                    isListening
                </Button>
            </div>
        </>
    )
}
