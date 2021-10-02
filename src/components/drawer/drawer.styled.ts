import styled, { css, keyframes } from "styled-components"

const transitionTime = "300ms"
const fadeInBox = keyframes`
    0% {
        transform: scaleX(0);
    }
    100% {
    }
`
const positionLeft = css`
    transform-origin: left;
    left: 0;
`
const positionRight = css`
    transform-origin: right;
    right: 0;
`
interface DrawerBoxProps {
    position: "left" | "right"
}
export const DrawerBox = styled.div<DrawerBoxProps>`
    z-index: 1000;
    position: fixed;
    top: 0;
    bottom: 0;
    width: min(20rem, 80%);
    display: flex;
    flex-direction: column;
    background: var(--color5);
    padding: 0.5rem;
    box-shadow: var(--box-shadow);
    animation: ${fadeInBox} ${transitionTime} ease-out;
    overflow-y: auto;
    overflow-x: hidden;
    ${({ position }) => (position === "left" ? positionLeft : positionRight)}
`

const fadeInBackground = keyframes`
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
`
export const DrawerBackground = styled.div`
    z-index: 900;
    position: fixed;
    background: var(--color6);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    animation: ${fadeInBackground} ${transitionTime} ease-in-out;
`

export const DrawerTitle = styled.h3`
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-left: 0.5rem;
    svg {
        height: 1em;
        width: 1em;
        stroke: black;
    }
`
export const DrawerContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`
