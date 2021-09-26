import { IconButton } from "components"
import styled from "styled-components"

export const ViewNavWrapper = styled.div`
    position: fixed;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    background: var(--color2);
    border-top-left-radius: var(--menubar-border-radius);
    border-bottom-left-radius: var(--menubar-border-radius);
    box-shadow: var(--box-shadow);
    overflow: hidden;
    padding: var(--menu-padding);
`
export const PageIndex = styled.span`
    font-size: 1.3rem;
`

export const PageIndexHr = styled.hr`
    width: 80%;
    height: 2px;
    background: var(--color1);
    border: none;
    transition: all 100ms ease-in-out;
`

export const IconButtonPageIndex = styled(IconButton)`
    height: fit-content;
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
    align-items: center;
    &:hover {
        ruby-span,
        hr {
            width: 100%;
        }
    }
`
