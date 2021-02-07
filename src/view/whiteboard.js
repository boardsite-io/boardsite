import React, { useState, useEffect } from "react"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import FPSStats from "react-fps-stats"
import { handleAddPage } from "../component/board/requestHandlers"
import TestPanel from "../testing/testpanel"
import Toolbar from "../component/menu/toolbar"
import Homebar from "../component/menu/homebar"
import Viewbar from "../component/menu/viewbar"

import SessionDialog from "../component/menu/sessiondialog"
import BoardStage from "../component/board/stage"
import { toolType } from "../constants"
import { SET_TYPE, TOGGLE_PANMODE } from "../redux/slice/drawcontrol"
import store from "../redux/store"
import { createWebsocket } from "../api/websocket"
import { createSession } from "../api/request"

export default function Whiteboard() {
    // console.log("Whiteboard Redraw")
    const [openSessionDialog, setOpenSessionDialog] = useState(false)
    const [sidInput, setSidInput] = useState("")

    function handleKeyPress(e) {
        switch (e.key) {
            case "p": // Pen
                store.dispatch(SET_TYPE(toolType.PEN))
                break
            case "1": // Pen
                store.dispatch(SET_TYPE(toolType.PEN))
                break
            case "e": // Eraser
                store.dispatch(SET_TYPE(toolType.ERASER))
                break
            case "2": // Eraser
                store.dispatch(SET_TYPE(toolType.ERASER))
                break
            case "d": // Drag
                store.dispatch(SET_TYPE(toolType.DRAG))
                break
            case "3": // Drag
                store.dispatch(SET_TYPE(toolType.DRAG))
                break
            case "l": // Line
                store.dispatch(SET_TYPE(toolType.LINE))
                break
            case "4": // Line
                store.dispatch(SET_TYPE(toolType.LINE))
                break
            case "t": // Triangle
                store.dispatch(SET_TYPE(toolType.TRIANGLE))
                break
            case "5": // Triangle
                store.dispatch(SET_TYPE(toolType.TRIANGLE))
                break
            case "c": // Circle
                store.dispatch(SET_TYPE(toolType.CIRCLE))
                break
            case "6": // Circle
                store.dispatch(SET_TYPE(toolType.CIRCLE))
                break
            case "z": // Undo (Ctrl + Z)
                if (e.ctrlKey && !e.repeat) {
                    store.dispatch(UndoActionCreators.undo())
                }
                break
            case "y": // Redo (Ctrl + Y)
                if (e.ctrlKey && !e.repeat) {
                    store.dispatch(UndoActionCreators.redo())
                }
                break
            case " ": // Undo (Ctrl + Z)
                store.dispatch(TOGGLE_PANMODE())
                break
            default:
                break
        }
    }

    // Open dialog on mount
    useEffect(() => {
        // setOpenSessionDialog(true);
        handleAddPage()
        document.addEventListener("keypress", handleKeyPress)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /**
     * Helper function for creating websocket connection and handling the resolve / reject
     * @param {string} sid
     */
    function createWS(sid) {
        createWebsocket(sid)
            .then(() => {
                navigator.clipboard.writeText(sid)
                setOpenSessionDialog(false)
            })
            .catch((error) =>
                // eslint-disable-next-line no-console
                console.error("Websocket creation failed!", error)
            )
    }

    /**
     * Handle the create session button click in the session dialog
     */
    function handleCreate() {
        createSession()
            .then(({ sessionId }) => {
                createWS(sessionId)
            })
            // eslint-disable-next-line no-console
            .catch(() => console.log("Session creation failed!"))
    }

    /**
     * Handle the join session button click in the session dialog
     */
    function handleJoin() {
        createWS(sidInput)
    }

    /**
     * Handle textfield events in the session dialog
     * @param {event} e event object
     */
    function handleTextFieldChange(e) {
        setSidInput(e.target.value)
    }

    return (
        <div>
            <FPSStats />
            <TestPanel />
            <SessionDialog
                open={openSessionDialog}
                setOpen={setOpenSessionDialog}
                handleJoin={handleJoin}
                handleCreate={handleCreate}
                handleTextFieldChange={handleTextFieldChange}
            />
            <Viewbar />
            <Toolbar />
            <Homebar setOpenSessionDialog={setOpenSessionDialog} />
            <BoardStage />
        </div>
    )
}
