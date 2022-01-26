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
    color: var(--cPrimary);
    border-radius: var(--button-border-radius);
    filter: opacity(75%);
    ${({ $toolColor }) =>
        css`
            background: ${$toolColor};
            box-shadow: var(--box-shadow);
        `}
`
