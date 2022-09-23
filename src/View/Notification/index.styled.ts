import { NOTIFICATION_TRANSITION } from "consts"
import styled, { css } from "styled-components"

export const NotificationWrap = styled.div`
    ${({ theme }) => css`
        z-index: ${theme.zIndex.notifications};
        pointer-events: none;
        position: fixed;
        top: 3rem;
        right: 50%;
        max-width: 80vw;
        display: flex;
        flex-direction: column;
        gap: 0;
        box-shadow: ${theme.toolbar.boxShadow};
        color: ${theme.palette.primary.contrastText};
        background: ${theme.palette.primary.main};
        border-radius: ${theme.borderRadius};
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
    `}
`

export const Message = styled.p`
    ${({ theme }) => css`
        padding: ${theme.menuButton.padding};
        margin: ${theme.menuButton.margin};
    `}
`
