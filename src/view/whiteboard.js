import React, { useState, useEffect } from "react"
import Page, { addPage } from "../component/board/page"
import Toolbar from "../component/menu/toolbar"
import Homebar from "../component/menu/homebar"
import AlertDialog from "../component/menu/session_dialog"
// import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux"
import { type } from "../constants.js"
import { setType, setIsDraggable } from "../redux/slice/drawcontrol.js"
import store from "../redux/store.js"

// import * as api from '../util/api';
// import * as proc from '../util/processing.js';
// import * as control from '../util/boardcontrol';

// import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch"
// import { jsPDF } from "jspdf";


export default function Whiteboard() {
    // const scaleRef = useRef(1)
    // const defaultPositionX = ((1 - 0.8) / 2) * window.innerWidth
    // const defaultPositionY = 60
    const [openSessionDialog, setOpenSessionDialog] = useState(false)
    const [sidInput, setSidInput] = useState("")
    const pageRank = useSelector(state => state.boardControl.present.pageRank)

    // Connect to session if valid session link
    // useEffect(() => {
    //     if (id !== undefined) { // Check if id specified in link
    //         setSessionID(id); // Set session id and connect to session
    //     }
    // }, [id])

    // Open dialog on mount
    useEffect(() => {
        // setOpenSessionDialog(true);
        addPage()
        document.addEventListener('keypress', handleKeyPress)
        return document.removeEventListener('keypress', handleKeyPress)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    function handleKeyPress(e) {
        switch (e.key) {
            case "p": store.dispatch(setType(type.PEN)); break;
            case "e": store.dispatch(setType(type.ERASER)); break;
            case "d": store.dispatch(setType(type.DRAG)); store.dispatch(setIsDraggable(true)); break;
            default: break;
        }
    }

    // Verify session id and try to connect to session
    // useEffect(() => {
    //     if (sessionID !== "") {
    //         api.createWebsocket(sessionID, onMsgHandle, null, null,).then((socket) => {
    //             // wsRef.current = socket;
    //             console.log(sessionID);
    //             navigator.clipboard.writeText(sessionID); // copy session ID to clipboard
    //         }).catch(() => console.log(`cannot connect websocket on '/${sessionID}'`));
    //     }
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [sessionID])

    // Handles messages from the websocket
    // function onMsgHandle(data) {
    //     const strokeObjectArray = JSON.parse(data.data);
    //     if (strokeObjectArray.length === 0) {
    //         actPage.deleteAll(setStrokeCollection, setHitboxCollection, setUndoStack, setRedoStack, pageCollection, setPageCollection);
    //     }
    //     else {
    //         let pageId = strokeObjectArray[0].pageId;
    //         let canvasRef = pageCollection[pageId];
    //         proc.processStrokes(strokeObjectArray, "message", setStrokeCollection, setHitboxCollection,
    //             setUndoStack, wsRef, canvasRef);
    //     }
    // }

    function handleCreate(e) {
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
        // setSessionID(sidInput);
    }

    function handleTextFieldChange(e) {
        // setSidInput(e.target.value)
    }

    function debug() {
        // console.log(boardInfo);
    }

    function exportToPDF() {
        // if (pageCollection.length === 0) {
        //     return;
        // }
        // const pdf = new jsPDF();
        // const width = pdf.internal.pageSize.getWidth();
        // const height = pdf.internal.pageSize.getHeight();
        // let canvasPage = pageCollection[0].canvasRef.current;
        // let imgData = canvasPage.toDataURL('image/png');
        // pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        // for (let i = 1; i < pageCollection.length; i++) {
        //     canvasPage = pageCollection[i].canvasRef.current;
        //     imgData = canvasPage.toDataURL('image/png');
        //     pdf.addPage();
        //     pdf.setPage(i + 1);
        //     pdf.addImage(imgData, 'PNG', 0, 0, width, height);
        // }
        // pdf.save("a4.pdf");
    }

    function save() {
        // TODO;
    }

    return (
        <div className="viewport">
            <AlertDialog
                open={openSessionDialog}
                setOpen={setOpenSessionDialog}
                sessionID_input={sidInput}
                setSessionID_input={setSidInput}
                handleTextFieldChange={handleTextFieldChange}
                handleJoin={handleJoin}
                handleCreate={handleCreate}
            />
            <Toolbar/>
            <Homebar
                setOpenSessionDialog={setOpenSessionDialog}
                exportToPDF={exportToPDF}
                save={save}
            />
            {/* <TransformWrapper
                defaultPositionX={defaultPositionX}
                defaultPositionY={defaultPositionY}
                defaultScale={defaultScale}
                onZoomChange={(e) => {
                    scaleRef.current = e.scale
                }}
                options={{
                    disabled: false,
                    minScale: 0.5,
                    maxScale: 2,
                    limitToBounds: false,
                    limitToWrapper: false,
                    centerContent: false,
                }}
                scalePadding={{
                    disabled: true,
                }}
                pan={{
                    disabled: true, //drawMode,
                    paddingSize: 0,
                }}
                wheel={{
                    disabled: false,
                    wheelEnabled: true,
                    step: 200,
                }}>
                {({
                    zoomIn,
                    zoomOut,
                    pan,
                    scale,
                    positionX,
                    positionY,
                    setPositionX,
                    setPositionY,
                    setScale,
                }) => (
                    <>
                        <Viewbar
                            pan={pan}
                            zoomIn={zoomIn}
                            zoomOut={zoomOut}
                            setScale={setScale}
                            scale={scale}
                            positionX={positionX}
                            positionY={positionY}
                            setPositionX={setPositionX}
                            setPositionY={setPositionY}
                        /> */}
            {/* <TransformComponent> */}
            <div className="pagecollectionouter">
                <div className="pagecollectioninner">
                    {pageRank.map((pageId) => {
                        return (
                            <Page
                                className="page"
                                pageId={pageId}
                                key={pageId}
                            // scaleRef={scaleRef}
                            />
                        )
                    })}
                </div>
            </div>
            {/* </TransformComponent>
                    </>
                )}
            </TransformWrapper> */}
        </div>
    )
}
