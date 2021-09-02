import styled from "styled-components"

interface StyledDividerProps {
    $color: "primary" | "secondary"
}
export const StyledDivider = styled.hr<StyledDividerProps>`
    background: ${({ $color }) =>
        $color === "primary" ? "var(--secondary)" : "var(--primary)"};
    width: 100%;
    height: 1px;
`
