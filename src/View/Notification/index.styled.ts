import { NOTIFICATION_TRANSITION } from "consts"
import styled from "styled-components"

export const NotificationWrap = styled.div`
    z-index: var(--zIndexNotifications);
    pointer-events: none;
    position: fixed;
    top: 3rem;
    right: 50%;
    max-width: 80vw;
    display: flex;
    flex-direction: column;
    gap: 0;
    box-shadow: var(--toolbar-box-shadow);
    color: ${({ theme }) => theme.palette.primary.contrastText};
    background: ${({ theme }) => theme.palette.primary.main};
    border-radius: var(--toolbar-border-radius);

    transition: all ${NOTIFICATION_TRANSITION}ms ease-in-out;

    transform-origin: center;
    transform: translate(50%, 0%);

    &.notification-enter {
        opacity: 0;
    }

    &.notification-enter-active {
        opacity: 1;
    }

    &.notification-exit {
        opacity: 1;
        transform: translate(50%, 0%);
    }

    &.notification-exit-active {
        opacity: 0;
        transform: translate(50%, -300%);
    }
`

export const Message = styled.p`
    padding: var(--main-menu-button-padding);
    margin: var(--main-menu-button-margin);
`
