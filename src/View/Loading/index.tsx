import { FormattedMessage } from "language"
import React, { useCallback } from "react"
import { loading } from "state/loading"
import { useGState } from "state"
import { DialogContent } from "components"
import { StyledDialog, Dot, LoadingDots } from "./index.styled"

const Loading: React.FC = () => {
    const { isLoading, messageId } = useGState("Loading").loading

    const onClose = useCallback(() => {
        // Abort loading animation on close
        loading.endLoading()
    }, [])

    return (
        <StyledDialog open={isLoading} onClose={onClose}>
            <DialogContent>
                <p>
                    <FormattedMessage id={messageId} />
                </p>
                <LoadingDots>
                    <Dot delay="0s" />
                    <Dot delay="0.4s" />
                    <Dot delay="0.8s" />
                </LoadingDots>
            </DialogContent>
        </StyledDialog>
    )
}

export default Loading
