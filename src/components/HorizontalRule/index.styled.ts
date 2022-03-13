import styled from "styled-components"

export const HorizontalRule = styled.hr`
    background: ${({ theme }) => theme.palette.common.rule};
    outline: none;
    border: none;
    width: 100%;
    height: 1px;
    margin: 0.1rem 0;
    padding: 0;
`
