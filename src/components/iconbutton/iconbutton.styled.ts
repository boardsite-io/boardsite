import styled from "styled-components"

interface Props {
    $active?: boolean
    $background?: string
}

export const StyledIconButton = styled.button`
    padding: 0.2rem;
    height: 2.5rem;
    width: 2.5rem;
    text-align: center;
    justify-self: center;
    outline: none;
    border-width: 0;
    border-radius: var(--button-border-radius);
    color: ${(props: Props) =>
        props.$active ? "var(--active-tool-color)" : "var(--color1)"};
    background: ${(props: Props) =>
        props.$background ? props.$background : "none"};
    &:hover {
        color: var(--color2);
    }
    #icon {
        height: 100%;
        width: 100%;
    }
`
