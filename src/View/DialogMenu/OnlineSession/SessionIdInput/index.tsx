import { TextField } from "components"
import { SESSION_ID_LENGTH } from "consts"
import { FormattedMessage } from "language"
import React, { useState } from "react"

const SessionIdInput: React.FC = () => {
    const [sessionId, setSessionId] = useState<string>("")

    return (
        <TextField
            label={
                <FormattedMessage id="DialogMenu.CreateOnline.TextFieldLabel.SessionId" />
            }
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            maxLength={SESSION_ID_LENGTH}
        />
    )
}

export default SessionIdInput
