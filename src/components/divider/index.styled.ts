import styled, { css } from "styled-components"

interface StyledDividerProps {
    $color: "primary" | "secondary"
}

export const StyledDivider = styled.hr<StyledDividerProps>`
    ${({ $color }) =>
        $color === "primary"
            ? css`
                  background: #00000022;
              `
            : css`
                  background: var(--cMenuItems);
              `};
    outline: none;
    border: none;
    width: 100%;
    height: 1px;
    margin: 0.1rem 0;
    padding: 0;
`
