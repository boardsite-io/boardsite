import styled, { css } from "styled-components"

export const ToolRingWrap = styled.div`
    ${({ theme }) => css`
        position: fixed;
        display: flex;
        flex-direction: column;
        top: 0;
        right: 0;
        margin: ${theme.toolbar.margin};
        padding: ${theme.toolbar.padding};
        gap: ${theme.toolbar.gap};
        box-shadow: ${theme.toolbar.boxShadow};
        z-index: ${theme.zIndex.toolRing};
        background: ${theme.palette.primary.main};
        border-radius: ${theme.borderRadius};
    `}
`
