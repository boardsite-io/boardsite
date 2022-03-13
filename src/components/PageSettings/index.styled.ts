import styled, { css } from "styled-components"

export const SELECTION_SIZE = "60px"

export const active = css`
    color: ${({ theme }) => theme.palette.secondary.main};
    box-shadow: 0 0 0 2px, inset 0 0 0 2px;
`
export const inactive = css`
    color: ${({ theme }) => theme.palette.secondary.main};
    box-shadow: 0 0 0 1px, var(--box-shadow);
`
export const PageSettingsWrap = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 2px; /* provide space for outline shadows */
`
export const PageSettingsInnerWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    max-width: 16rem;
`
