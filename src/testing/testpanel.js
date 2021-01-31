import React from "react"
import "./testpanel.css"

import { Button } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"

import overload, { dispatchTest, dispatchTestSingle } from "./stresstest"

export default function TestPanel() {
    return (
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
    )
}
