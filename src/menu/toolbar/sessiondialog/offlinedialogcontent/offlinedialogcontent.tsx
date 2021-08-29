import React from "react"
import { useHistory } from "react-router-dom"
import { useCustomDispatch, useCustomSelector } from "redux/hooks"
import store from "redux/store"
import {
    SET_SDIAG,
    CLOSE_SDIAG,
    SET_USER_ALIAS,
    SET_USER_COLOR,
} from "redux/slice/webcontrol"
import { getSessionPath, joinSession, newSession } from "api/websocket"
import { Button, TextField } from "@components"
import {
    OfflineDialogWrapper,
    UserColorButton,
    UserSelection,
} from "./offlinedialogcontent.styled"

const OfflineDialogContent: React.FC = () => {
    const sDiagStatus = useCustomSelector(
        (state) => state.webControl.sessionDialog
    )
    const userAlias = useCustomSelector((state) => state.webControl.user.alias)
    const userColor = useCustomSelector((state) => state.webControl.user.color)

    const dispatch = useCustomDispatch()
    const history = useHistory()

    /**
     * Handle the create session button click in the session dialog
     */
    const handleCreate = async () => {
        try {
            const sessionId = await newSession()
            dispatch(SET_SDIAG({ sidInput: sessionId }))
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
            const { sidInput } = store.getState().webControl.sessionDialog
            history.push(getSessionPath(sidInput))
            dispatch(CLOSE_SDIAG())
        } catch (error) {
            dispatch(
                SET_SDIAG({
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
        dispatch(SET_SDIAG({ sidInput: e.target.value }))
    }

    const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(SET_USER_ALIAS(e.target.value))
    }

    const newRandomColor = () => {
        dispatch(SET_USER_COLOR())
    }

    return (
        <OfflineDialogWrapper>
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
        </OfflineDialogWrapper>
    )
}

export default OfflineDialogContent
