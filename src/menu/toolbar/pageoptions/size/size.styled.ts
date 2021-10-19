import styled, { css } from "styled-components"

export const SizePresets = styled.form`
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1.5rem;
`

const sharedStyle = css<props>`
    background: white;
    border: none;
    border-radius: var(--button-border-radius);
    ${({ $active }) => ($active ? active : inactive)};
    &:hover {
        cursor: pointer;
    }
`
const active = css`
    box-shadow: 0 0 0 4px var(--color3);
`
const inactive = css`
    box-shadow: 0 0 0 1px green, var(--box-shadow);
`

interface props {
    $active: boolean
}
export const A4Landscape = styled.input<props>`
    ${sharedStyle}
    height: 5rem;
    width: 3.5rem;
`
export const A4Portrait = styled.input<props>`
    ${sharedStyle}
    height: 3.5rem;
    width: 5rem;
`
