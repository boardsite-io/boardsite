import styled from "styled-components"

export const BenefitList = styled.ul`
    align-items: left;
    position: relative;
    list-style: none;
    padding: 0 1rem;
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
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: ${({ theme }) => theme.palette.secondary.contrastText};
    background: ${({ theme }) => theme.palette.secondary.main};
    margin: 6px 0;
    padding: 10px 1.5rem;
    border-width: 0;
    border-radius: var(--border-radius);
    transition: all 100ms ease-in-out;
    box-shadow: var(--box-shadow);
    height: min-content;

    &:hover {
        filter: brightness(120%);
    }

    &:disabled {
        cursor: not-allowed;
        filter: brightness(40%);
    }

    text-decoration: none;
`
