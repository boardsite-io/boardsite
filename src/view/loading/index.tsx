import React from "react"
import { useCustomSelector } from "hooks"
import { END_LOADING } from "redux/loading/loading"
import store from "redux/store"
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

const Loading: React.FC = () => {
    const { isLoading, message } = useCustomSelector((state) => state.info)

    // Abort loading animation on close
    const onClose = () => {
        store.dispatch(END_LOADING())
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
                <Message>{message}</Message>
            </StyledDialogContent>
        </StyledDialog>
    )
}

export default Loading
