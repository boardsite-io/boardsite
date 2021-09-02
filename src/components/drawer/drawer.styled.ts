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
    background: white;
    padding: 0.5rem;
    box-shadow: var(--box-shadow);
    animation: ${fadeInBox} ${transitionTime} ease-out;
    overflow-y: scroll;
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
    position: fixed;
    background: #000000aa;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 900;
    animation: ${fadeInBackground} ${transitionTime} ease-in-out;
`

// export const DrawerContent = styled.div`
//     display: flex;
//     flex-direction: column;
//     flex-grow: 1;
//     overflow-y: scroll;
//     gap: 1rem;
//     margin: 1.5rem;
//     text-align: justify;
// `

// export const DrawerTitle = styled.h2`
//     margin: 1.3rem 1rem;
// `
