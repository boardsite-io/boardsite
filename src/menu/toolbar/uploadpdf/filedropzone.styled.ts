import styled, { css, keyframes } from "styled-components"

const fileHoverKeyFrame = keyframes`
    0%{
        background-position-x:0%;
	}
	100% {
        background-position-x:1000000%;
	}
    `
const fileHoverAnimation = css`
    animation: ${fileHoverKeyFrame} 80000s infinite linear forwards;
    background-image: repeating-linear-gradient(
        -45deg,
        #88bb8855,
        #22bb3333 10px,
        #88bb8855 20px,
        #00000000 20px,
        #00000000 40px
    );
    background-size: 56px 56px; /* This is unique for this background, need to find a pattern and develop a formula */
    background-position-x: 0%;
    background-repeat: repeat;
`
interface Props {
    $hovering: boolean
}
export const DropZone = styled.div<Props>`
    display: flex;
    flex-direction: column;
    min-height: 12rem;
    border-radius: 0.4rem;
    border-style: ${({ $hovering }) => ($hovering ? "solid" : "dashed")};
    border-width: 1px;
    text-align: center;
    align-items: center;
    justify-content: center;
    :hover {
        cursor: pointer;
    }
    svg {
        stroke: var(--color3);
        height: 4rem;
        width: 4rem;
        pointer-events: none;
    }
    ${({ $hovering }) => ($hovering ? fileHoverAnimation : null)};
`

const textStyle = css`
    max-width: 12rem;
    margin: 0.2rem 1rem;
    pointer-events: none;
`

export const InfoText = styled.h4`
    ${textStyle}
`

export const ErrorText = styled.p`
    color: red;
    ${textStyle}
`

export const InvisibleInput = styled.input`
    display: none;
`
