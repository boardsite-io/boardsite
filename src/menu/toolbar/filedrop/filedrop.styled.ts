import { BsCloudUpload } from "react-icons/bs"
import styled, { css, keyframes } from "styled-components"

interface Props {
    $hovering: boolean
}

const backgroundHovering = css`
    background-image: repeating-linear-gradient(
        -45deg,
        #88bb8855,
        #22bb3333 10px,
        #88bb8855 20px,
        #00000000 20px,
        #00000000 40px
    );
`
const fileHoverKeyFrame = keyframes`
    0%{
		background-position-x:0%;
	}
	100% {
		background-position-x:1000000%;
	}
`
const fileHoverAnimation = css`
    animation: ${fileHoverKeyFrame} 50000s infinite linear forwards;
`
export const StyledFileDropZone = styled.div<Props>`
    margin: 1rem;
    display: flex;
    background-repeat: repeat;
    ${({ $hovering }) => ($hovering ? backgroundHovering : null)};
    ${({ $hovering }) => ($hovering ? fileHoverAnimation : null)};
    background-size: 56px 56px; /* This is unique for this background, need to find a pattern and develop a formula */
    background-position-x: 0%;
    height: 12rem;
    width: auto;
    border-radius: 5px;
    border-style: ${({ $hovering }) => ($hovering ? "solid" : "dashed")};
    border-width: 1px;
    text-align: center;
    align-items: center;
    justify-content: center;
    :hover {
        cursor: pointer;
    }
`

export const StyledDivNoTouch = styled.div`
    pointer-events: none;
`

export const StyledIcon = styled(BsCloudUpload)`
    height: 50px;
    width: 50px;
`

export const StyledTitle = styled.h4`
    margin-bottom: 10px;
    margin-top: 5px;
`

export const StyledSubtitle = styled.p`
    margin-bottom: 5px;
    margin-top: 5px;
`
