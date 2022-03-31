import styled from "styled-components"

interface ColorProps {
    $color: string
}

export const ColorButton = styled.button`
    background: ${(props: ColorProps) => props.$color};
    height: 30px;
    width: 30px;
    border-radius: 100%;
    border: none;
    margin: 0;
    padding: 0;

    &:hover {
        cursor: pointer;
    }
`
