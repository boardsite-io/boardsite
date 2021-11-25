import React from "react"
import { useNavigate } from "react-router-dom"
import { useCustomDispatch, useCustomSelector } from "hooks"
import store from "redux/store"
import {
    SET_SESSION_DIALOG,
    CLOSE_SESSION_DIALOG,
    SET_USER_ALIAS,
    SET_USER_COLOR,
} from "redux/session/session"
import { getSessionPath, joinSession, newSession } from "api/websocket"
import { Button, DialogContent, TextField } from "components"
import { UserColorButton, UserSelection } from "./offlinedialogcontent.styled"

const OfflineDialogContent: React.FC = () => {
    const sDiagStatus = useCustomSelector(
        (state) => state.session.sessionDialog
    )
    const userAlias = useCustomSelector((state) => state.session.user.alias)
    const userColor = useCustomSelector((state) => state.session.user.color)

    const dispatch = useCustomDispatch()
    const navigate = useNavigate()

    /**
     * Handle the create session button click in the session dialog
     */
    const handleCreate = async () => {
        try {
            const sessionId = await newSession()
            dispatch(SET_SESSION_DIALOG({ sidInput: sessionId }))
            await handleJoin()
        } catch (error) {
            // console.log("error")
        }
    }

    /**
     * Handle the join session button click in the session dialog
     */
    const handleJoin = async () => {
        try {
            await joinSession()
            const { sidInput } = store.getState().session.sessionDialog
            navigate(getSessionPath(sidInput))
            dispatch(CLOSE_SESSION_DIALOG())
        } catch (error) {
            dispatch(
                SET_SESSION_DIALOG({
                    open: true,
                    invalidSid: true,
                    joinOnly: false,
                })
            )
        }
    }

    /**
     * Handle textfield events in the session dialog
     * @param {event} e event object
     */
    const handleTextFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(SET_SESSION_DIALOG({ sidInput: e.target.value }))
    }

    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(SET_USER_ALIAS(e.target.value))
    }

    const newRandomColor = () => {
        dispatch(SET_USER_COLOR())
    }

    return (
        <DialogContent>
            <UserSelection>
                <UserColorButton
                    type="button"
                    $color={userColor}
                    onClick={newRandomColor}
                />
                <TextField
                    value={userAlias}
                    label="Choose alias"
                    onChange={handleAliasChange}
                    maxLength={20}
                    align="left"
                />
            </UserSelection>
            {!sDiagStatus.joinOnly && (
                <Button onClick={handleCreate}>Create Session</Button>
            )}
            <Button onClick={handleJoin}>Join Session</Button>
            {!sDiagStatus.joinOnly && (
                <TextField
                    label="Insert ID"
                    value={sDiagStatus.sidInput}
                    onChange={handleTextFieldChange}
                    helperText={
                        sDiagStatus.invalidSid
                            ? "Looks like the session you're trying to join does not exist 🤖"
                            : ""
                    }
                />
            )}
        </DialogContent>
    )
}

export default OfflineDialogContent
