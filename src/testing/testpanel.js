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
                placement="left">
                <Button>xD</Button>
            </Tooltip>

            <Button className="testPanelButtons" onClick={overload}>
                !
            </Button>
            <Button onClick={dispatchTest}>2</Button>
            <Button onClick={dispatchTestSingle}>3</Button>
        </div>
    )
}
