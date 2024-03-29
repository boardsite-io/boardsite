import styled, { css } from "styled-components"

export const ToolButtonWrap = styled.div`
    position: relative;
`

export const ToolInfo = styled.div<{ $toolColor: string }>`
    touch-action: none;
    pointer-events: none;
    position: absolute;
    text-align: center;
    bottom: -0.2rem;
    right: 0;
    padding: 0 0.3rem;
    color: ${({ theme }) => theme.palette.secondary.contrastText};
    border-radius: ${({ theme }) => theme.borderRadius};
    box-shadow: ${({ theme }) => theme.boxShadow};
    ${({ $toolColor }) =>
        css`
            background: ${$toolColor}66;
        `}
`
