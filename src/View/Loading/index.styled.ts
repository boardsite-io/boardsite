import { Dialog } from "components"
import styled from "styled-components"

export const StyledDialog = styled(Dialog)`
    width: min(20rem, 90vw);
`

export const LoadingDots = styled.div`
    margin-top: 2rem;
    display: flex;
    gap: 1rem;
    justify-content: center;
`
export const Dot = styled.div<{ delay: string }>`
    color: ${({ theme }) => theme.palette.secondary.main};
    background: ${({ theme }) => theme.palette.secondary.main};
    box-shadow: 0 0 0.2rem 0;
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 100%;
    animation-name: loading-animation;
    animation-duration: 1.5s;
    animation-delay: ${({ delay }) => delay};
    animation-iteration-count: infinite;
    animation-direction: alternate;
    animation-timing-function: ease-in-out;

    @keyframes loading-animation {
        0% {
            opacity: 0;
        }
        40% {
            opacity: 0;
        }
        100% {
            opacity: 1;
        }
    }
`
