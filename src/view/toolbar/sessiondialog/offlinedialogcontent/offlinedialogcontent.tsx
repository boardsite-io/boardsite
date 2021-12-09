import React from "react"
import Konva from "konva"
import { useNavigate } from "react-router-dom"
import { useCustomDispatch, useCustomSelector } from "hooks"
import store from "redux/store"
import { SET_SESSION_DIALOG, CLOSE_SESSION_DIALOG } from "redux/session/session"
import { Session } from "api/types"
import { BoardSession, currentSession } from "api/session"
import { Button, DialogContent, TextField } from "components"
import { UserColorButton, UserSelection } from "./offlinedialogcontent.styled"

const OfflineDialogContent: React.FC = () => {
    const sDiagStatus = useCustomSelector(
        (state) => state.session.sessionDialog
    )

    const dispatch = useCustomDispatch()
    const navigate = useNavigate()

    const getSession = React.useCallback<() => Session>(
        () => currentSession(),
        []
    )

    /**
     * Handle the create session button click in the session dialog
     */
    const handleCreate = async () => {
        try {
            const sessionId = await getSession().create()
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
            const { sidInput } = store.getState().session.sessionDialog
            const path = BoardSession.path(sidInput)
            await getSession().join(path.split("/").pop())
            navigate(path)
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
        getSession().updateUser({ alias: e.target.value })
    }

    const newRandomColor = () => {
        getSession().updateUser({ color: Konva.Util.getRandomColor() })
    }

    return (
        <DialogContent>
            <UserSelection>
                <UserColorButton
                    type="button"
                    $color={getSession().user.color}
                    onClick={newRandomColor}
                />
                <TextField
                    value={getSession().user.alias}
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
