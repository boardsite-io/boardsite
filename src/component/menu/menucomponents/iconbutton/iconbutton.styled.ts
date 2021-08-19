import styled from "styled-components"

interface Props {
    $active?: boolean
}

export const StyledIconButton = styled.button`
    padding: 3px;
    color: ${(props: Props) =>
        props.$active ? "var(--active-tool-color)" : "var(--primary)"};
    text-align: center;
    border-radius: var(--button-border-radius);
    height: var(--button-height);
    width: var(--button-width);
    outline: none;
    border-width: 0;
    background: none;
    justify-self: center;
    &:hover {
        color: var(--secondary);
    }
`
