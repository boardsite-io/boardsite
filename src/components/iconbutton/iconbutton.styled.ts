import styled from "styled-components"

interface Props {
    $active?: boolean
    $background?: string
}

export const StyledIconButton = styled.button<Props>`
    padding: 0.2rem;
    height: var(--icon-button-width);
    width: var(--icon-button-width);
    text-align: center;
    justify-self: center;
    outline: none;
    border: none;
    border-radius: var(--button-border-radius);
    color: ${({ $active }) => ($active ? "var(--color7)" : "var(--color1)")};
    background: ${({ $background }) => $background ?? "none"};
    &:hover {
        color: var(--color2);
    }
    #icon {
        height: 100%;
        width: 100%;
    }
`
