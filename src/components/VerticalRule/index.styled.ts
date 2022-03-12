import styled from "styled-components"

export const VerticalRule = styled.div`
    background: ${({ theme }) => theme.palette.common.rule};
    outline: none;
    border: none;
    height: var(--icon-button-size);
    width: 1px;
    margin: 0;
    padding: 0;
`
