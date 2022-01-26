import styled from "styled-components"

interface ColorProps {
    $color: string
}

export const ColorButton = styled.button`
    background: ${(props: ColorProps) => props.$color};
    height: 1.5rem;
    width: 1.5rem;
    border-radius: 100%;
    border: none;
    &:hover {
        cursor: pointer;
    }
`

export const Selection = styled.div`
    display: flex;
    justify-content: left;
    align-items: center;
    gap: 1rem;
`
