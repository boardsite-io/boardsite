import { Dialog, DialogContent } from "components"
import styled, { css } from "styled-components"

export const StyledDialog = styled(Dialog)`
    width: min(20rem, 90vw);
`

export const StyledDialogContent = styled(DialogContent)`
    display: flex;
    flex-direction: column;
    align-items: center;
`

export const Frame = styled.div<{ remStart: number }>`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: ${({ remStart }) => `${remStart}rem`};
    height: ${({ remStart }) => `${remStart}rem`};
`

const getSettingsFor = (circleSize: string) => css`
    position: absolute;
    overflow: hidden;
    border-radius: 100%;
    width: ${circleSize};
    height: ${circleSize};
`

interface RingProps {
    diameter: number
}

// Loading ring
export const Ring = styled.div<RingProps>`
    background: var(--cDetails);
    ${({ diameter }) => getSettingsFor(`${diameter}rem`)};
`

// Most inner circle
export const Cover = styled.div<RingProps>`
    background: var(--cDetails2);
    ${({ diameter }) => getSettingsFor(`${diameter}rem`)};
`

// Loading message
export const Message = styled.p``

interface SpinnerProps {
    spinnerAnimation: string
}

// Spinner animation for each ring
export const Spinner = styled.div<SpinnerProps>`
    background: var(--cDetails2);

    width: 50%;
    height: 100%;
    transform-origin: right;

    -webkit-animation: ${({ spinnerAnimation }) => `${spinnerAnimation}`};
    -moz-animation: ${({ spinnerAnimation }) => `${spinnerAnimation}`};
    animation: ${({ spinnerAnimation }) => `${spinnerAnimation}`};

    @-moz-keyframes spin {
        100% {
            -moz-transform: rotate(360deg);
        }
    }
    @-webkit-keyframes spin {
        100% {
            -webkit-transform: rotate(360deg);
        }
    }
    @keyframes spin {
        100% {
            -webkit-transform: rotate(360deg);
            transform: rotate(360deg);
        }
    }
`
