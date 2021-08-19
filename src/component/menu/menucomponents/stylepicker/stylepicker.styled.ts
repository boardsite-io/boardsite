import styled from "styled-components"

export const StyledStylePicker = styled.div`
    display: flex;
    flex-direction: row;
    background: #00000088;
    border-radius: var(--menubar-border-radius);
    height: 200px;
    width: 280px;
    position: fixed;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    /* position: absolute;
    top: 10px;
    left: -5px; */
    padding: 5px;
    box-shadow: var(--box-shadow);
    justify-content: space-between;
`
