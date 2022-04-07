import styled from "styled-components"

export const StylePickerWrap = styled.div`
    z-index: var(--zIndexToolRing);
    position: absolute;
    right: 100%;
    top: 0;
    display: flex;
    margin-right: var(--toolbar-margin);
    display: flex;
    gap: 6px;
    padding: 6px;
    height: 15rem;
    min-width: 18rem;
    width: 75vw;
    max-width: 25rem;

    background: ${({ theme }) => theme.palette.primary.main};
    border-radius: var(--border-radius);
    box-shadow: var(--toolbar-box-shadow);

    button {
        margin: 2px;
    }
`
