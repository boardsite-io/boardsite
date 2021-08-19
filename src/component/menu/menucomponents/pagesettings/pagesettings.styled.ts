import styled, { css } from "styled-components"

const sharedStyle = css`
    height: 50px;
    width: 50px;
    outline: none;
    border-radius: 5px;
    border-width: 1px;
`

export const PagePreviewBlank = styled.button`
    ${sharedStyle}
    background: white;
`
export const PagePreviewCheckered = styled.button`
    ${sharedStyle}
    background-image: repeating-linear-gradient(
            90deg,
            transparent 0px,
            transparent 9px,
            teal 10px
        ),
        repeating-linear-gradient(0deg, white 0px, white 9px, teal 10px);
`
export const PagePreviewRuled = styled.button`
    ${sharedStyle}
    background-image: repeating-linear-gradient(
        white 0px,
        white 9px,
        teal 10px
    );
`
