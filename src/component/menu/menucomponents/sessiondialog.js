import React, { useState } from "react"
import { SiReact } from "react-icons/si"
import { MdSettingsPower, MdGroupAdd } from "react-icons/md"
import { newSession, joinSession } from "../../../api/websocket"

import "../../../css/sessiondialog.css"

export default function SessionDialog() {
    const [open, setOpen] = useState(false)
    /**
     * Handle the create session button click in the session dialog
     */
    function handleCreate() {
        newSession()
            .then((sessionId) => handleJoin(sessionId))
            .catch((err) => console.log("cant create session: ", err))
    }

    /**
     * Handle the join session button click in the session dialog
     */
    function handleJoin(sessionId) {
        // createWS(sidInput)
        // request data?
        joinSession(sessionId)
            .then(() => setOpen(false))
            .catch(() => console.log("cant connect"))
    }

    /**
     * Handle textfield events in the session dialog
     * @param {event} e event object
     */
    function handleTextFieldChange(e) {
        if (e.target.value.length === 6) {
            console.log(e.target.value)
            handleJoin(e.target.value)
        }
    }

    return (
        <div className="session-dialog-div">
            <button
                type="button"
                id="icon-button"
                onClick={() => setOpen(true)}>
                <MdGroupAdd id="icon" />
            </button>
            {
                // Palette Popup
                open ? (
                    <div className="popup">
                        <div
                            role="button"
                            tabIndex="0"
                            className="cover"
                            onClick={() => setOpen(false)}
                            onKeyPress={() => {}}
                        />
                        <div className="session-dialog">
                            <div className="session-dialog-wrap">
                                <div className="dialog-buttons-wrap">
                                    <button
                                        type="button"
                                        id="buttonDialog"
                                        onClick={handleCreate}>
                                        <SiReact id="buttonIcon" />
                                    </button>
                                    <button
                                        type="button"
                                        id="buttonDialog"
                                        onClick={handleJoin}>
                                        <MdSettingsPower id="buttonIcon" />
                                    </button>
                                </div>
                                <input
                                    className="sessionDialogInput"
                                    type="search"
                                    defaultValue="hi"
                                    onChange={handleTextFieldChange}
                                />
                            </div>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}
