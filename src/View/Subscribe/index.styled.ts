import { Dialog } from "components"
import styled from "styled-components"

export const SubscribeCard = styled(Dialog)`
    width: fit-content;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    background: #333;
    color: white;
    border-radius: var(--border-radius);
`

export const BenefitList = styled.ul`
    align-items: left;
    position: relative;
    list-style: none;
    padding: 1rem 2.5rem;
    margin: 0;
`

export const BenefitItem = styled.li`
    display: flex;
    align-items: center;
    gap: 1rem;
    width: fit-content;
    margin: 1rem 0;

    --svg-color: #34b233;

    .external-icon {
        height: 1rem;
        width: 1rem;
        fill: var(--svg-color);
        stroke: var(--svg-color);
        stroke-width: 15;
    }

    svg:not(.external-icon) {
        height: 1rem;
        width: 1rem;
        transform: scale(1.2);
        stroke: var(--svg-color) !important;
        stroke-width: 15 !important;
    }
`

export const SubscribeButton = styled.a`
    text-align: center;
    color: var(--cPrimary);
    background: var(--cTertiary);
    padding: 1rem 2rem;
    cursor: pointer;
    text-decoration: none;
    transition: all 100ms ease-in-out;

    &:hover {
        background: var(--cQuaternary);
    }
`
