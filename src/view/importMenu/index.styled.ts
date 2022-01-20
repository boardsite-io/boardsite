import styled, { css } from "styled-components"

interface Props {
    $hovering: boolean
}

export const DropZone = styled.div<Props>`
    display: flex;
    flex-direction: column;
    min-height: 12rem;
    border-radius: 0.4rem;
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
    border-style: dashed;

    transition: all 500ms;
    ${({ $hovering }) =>
        $hovering
            ? css`
                  background: #00ff0022;
              `
            : css``};
`

export const InfoText = styled.h4`
    margin: 0.2rem 1rem;
    pointer-events: none;
`

export const SupportedTypesText = styled.h4`
    margin: 0;
`

export const ErrorText = styled.p`
    color: red;
    margin: 0;
`

export const InvisibleInput = styled.input`
    display: none;
`
