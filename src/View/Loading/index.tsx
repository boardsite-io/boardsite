import { FormattedMessage } from "language"
import React from "react"
import { loading, useLoading } from "state/loading"
import {
    Cover,
    Frame,
    Message,
    Spinner,
    Ring,
    StyledDialogContent,
    StyledDialog,
} from "./index.styled"

// all in rem
const RING_THICKNESS = 0.5
const REM_START = 4
const NUM_RINGS = 6

const ringDiameters = Array(NUM_RINGS)
    .fill(null)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .map((_, i) => REM_START - i * RING_THICKNESS)

const spinnerAnimations = ringDiameters.map((diameter, i) =>
    i % 2 === 0
        ? `spin ${diameter}s linear reverse infinite`
        : `spin ${diameter}s linear infinite`
)

// TODO: Check why loading animation isn't showing properly and redesign
const Loading: React.FC = () => {
    const { isLoading, loadingInfo } = useLoading()

    // Abort loading animation on close
    const onClose = () => {
        loading.endLoading()
    }

    return (
        <StyledDialog open={isLoading} onClose={onClose}>
            <StyledDialogContent>
                <Frame remStart={REM_START}>
                    {ringDiameters.map((diameter, i) => (
                        <Ring key={diameter} diameter={diameter}>
                            <Spinner
                                key={diameter}
                                spinnerAnimation={spinnerAnimations[i]}
                            />
                        </Ring>
                    ))}
                    <Cover diameter={REM_START - NUM_RINGS * RING_THICKNESS} />
                </Frame>
                <Message>
                    <FormattedMessage id={loadingInfo.messageId} />
                </Message>
            </StyledDialogContent>
        </StyledDialog>
    )
}

export default Loading
