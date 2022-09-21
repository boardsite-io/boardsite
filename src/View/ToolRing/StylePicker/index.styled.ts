import styled, { css } from "styled-components"

export const StylePickerWrap = styled.div`
    ${({ theme }) => css`
        z-index: ${theme.zIndex.toolRing};
        position: absolute;
        right: 100%;
        top: 0;
        display: flex;
        margin-right: ${theme.toolbar.margin};
        display: flex;
        gap: 6px;
        padding: 6px;
        height: 15rem;
        min-width: 18rem;
        width: 75vw;
        max-width: 25rem;

        background: ${theme.palette.primary.main};
        border-radius: ${theme.borderRadius};
        box-shadow: ${theme.toolbar.boxShadow};

        button {
            margin: 2px;
        }
    `}
`
