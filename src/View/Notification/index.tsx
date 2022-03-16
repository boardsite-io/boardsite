import { FormattedMessage, IntlMessageId } from "language"
import React, { Fragment } from "react"
import { useGState } from "state"
import { HorizontalRule } from "components"
import { CSSTransition } from "react-transition-group"
import { NOTIFICATION_TRANSITION } from "consts"
import { nanoid } from "nanoid"
import { Message, NotificationWrap } from "./index.styled"

let lastNonEmptyState: IntlMessageId[] = []

const Notification: React.FC = () => {
    const { notifications } = useGState("Notification").notification

    // Keep last non empty state for fade out animation
    if (notifications.length > 0) {
        lastNonEmptyState = notifications
    }

    return (
        <CSSTransition
            in={notifications.length > 0}
            unmountOnExit
            timeout={NOTIFICATION_TRANSITION}
            classNames="notification"
        >
            <NotificationWrap>
                {lastNonEmptyState.map((id, i) => {
                    return (
                        <Fragment key={id + nanoid()}>
                            {i > 0 && <HorizontalRule />}
                            <Message>
                                <FormattedMessage id={id} />
                            </Message>
                        </Fragment>
                    )
                })}
            </NotificationWrap>
        </CSSTransition>
    )
}

export default Notification
