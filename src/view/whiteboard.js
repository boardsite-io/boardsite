import React, { useState, useEffect } from "react"
import { ActionCreators as UndoActionCreators } from "redux-undo"
import FPSStats from "react-fps-stats"
import { addPage } from "../component/menu/pagemenu"
import TestPanel from "../testing/testpanel"
import Toolbar from "../component/menu/toolbar"
import Homebar from "../component/menu/homebar"
import Viewbar from "../component/menu/viewbar"

import SessionDialog from "../component/menu/sessiondialog"
import BoardStage from "../component/board/stage"
import { createWebsocket } from "../component/board/websocket"
import { toolType } from "../constants"
import { SET_TYPE, TOGGLE_PANMODE } from "../redux/slice/drawcontrol"
import store from "../redux/store"

export default function Whiteboard() {
    // console.log("Whiteboard Redraw")
    const [openSessionDialog, setOpenSessionDialog] = useState(false)
    const [sessionId, setSessionId] = useState()
    const [sidInput, setSidInput] = useState("")

    // const pageRank = useSelector(state => state.boardControl.present.pageRank)
    // Connect to session if valid session link
    // useEffect(() => {
    //     if (sidInput !== undefined) {
    //         // Check if id specified in link
    //         setSessionId(sidInput) // Set session id and connect to session
    //     }
    // }, [sidInput])

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
        addPage()
        document.addEventListener("keypress", handleKeyPress)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // Verify session id and try to connect to session
    useEffect(() => {
        if (sessionId !== "") {
            createWebsocket(sessionId)
        }
    }, [sessionId])

    function handleCreate() {
        // let boardDim = { x: 10, y: 10 };
        // api.createBoardRequest(boardDim).then((data) => {
        //     api.getPages(data.id).then((data) => {
        //         console.log(data);
        //         setSessionID(data.id);
        //         setOpenSessionDialog(false); // close dialog
        //     }).catch(() => console.log("server cannot get pages"));
        // }).catch(() => console.log("server cannot create session"));
    }

    function handleJoin() {
        setSessionId(sidInput)
    }

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
                sessionID_input={sidInput}
                setSessionID_input={setSidInput}
                handleTextFieldChange={handleTextFieldChange}
                handleJoin={handleJoin}
                handleCreate={handleCreate}
            />
            <Viewbar />
            <Toolbar />
            <Homebar setOpenSessionDialog={setOpenSessionDialog} />
            <BoardStage />
        </div>
    )
}
