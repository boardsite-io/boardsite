import { FormattedMessage } from "language"
import React, { useCallback } from "react"
import { loading } from "state/loading"
import { useGState } from "state"
import {
    StyledDialogContent,
    StyledDialog,
    Dot,
    LoadingDots,
} from "./index.styled"

// TODO: Check why loading animation isn't showing properly in some cases
const Loading: React.FC = () => {
    const { isLoading, loadingInfo } = useGState("Loading").loading

    const onClose = useCallback(() => {
        // Abort loading animation on close
        loading.endLoading()
    }, [])

    return (
        <StyledDialog open={isLoading} onClose={onClose}>
            <StyledDialogContent>
                <p>
                    <FormattedMessage id={loadingInfo.messageId} />
                </p>
                <LoadingDots>
                    <Dot delay="0s" />
                    <Dot delay="0.4s" />
                    <Dot delay="0.8s" />
                </LoadingDots>
            </StyledDialogContent>
        </StyledDialog>
    )
}

export default Loading
