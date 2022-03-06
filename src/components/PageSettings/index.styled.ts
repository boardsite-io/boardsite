import styled, { css } from "styled-components"

export const SELECTION_SIZE = "60px"

export const active = css`
    box-shadow: 0 0 0 2px var(--cDetails), inset 0 0 0 2px var(--cDetails);
`
export const inactive = css`
    box-shadow: 0 0 0 1px var(--cDetails), var(--box-shadow);
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
