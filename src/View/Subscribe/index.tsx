import { AUTH_URL } from "api/auth"
import { TickIcon } from "components"
import { FormattedMessage } from "language"
import React, { useCallback } from "react"
import { FaInfinity } from "react-icons/fa"
import { menu } from "state/menu"
import { useGState } from "state"
import {
    BenefitItem,
    BenefitList,
    SubscribeButton,
    SubscribeCard,
} from "./index.styled"

const Benefit = ({
    icon,
    text,
}: {
    icon: React.ReactNode
    text: React.ReactNode
}) => (
    <BenefitItem>
        {icon}
        {text}
    </BenefitItem>
)

const Subscribe: React.FC = () => {
    const { subscribeOpen } = useGState("SubscribeOpen").menu

    const onClose = useCallback(() => {
        // Abort loading animation on close
        menu.closeSubscribe()
    }, [])

    return (
        <SubscribeCard open={subscribeOpen} onClose={onClose}>
            <BenefitList>
                <Benefit
                    icon={<FaInfinity className="external-icon" />}
                    text={<FormattedMessage id="Dialog.Sponsor.Benefit1" />}
                />
                <Benefit
                    icon={<TickIcon />}
                    text={<FormattedMessage id="Dialog.Sponsor.Benefit2" />}
                />
                <Benefit
                    icon={<TickIcon />}
                    text={<FormattedMessage id="Dialog.Sponsor.Benefit3" />}
                />
                <Benefit
                    icon={<TickIcon />}
                    text={<FormattedMessage id="Dialog.Sponsor.Benefit4" />}
                />
                <Benefit
                    icon={<TickIcon />}
                    text={<FormattedMessage id="Dialog.Sponsor.Benefit5" />}
                />
                <Benefit
                    icon={<TickIcon />}
                    text={<FormattedMessage id="Dialog.Sponsor.Benefit6" />}
                />
            </BenefitList>
            <SubscribeButton href={AUTH_URL}>
                <FormattedMessage id="Dialog.Sponsor.SubscribeButton" />
            </SubscribeButton>
        </SubscribeCard>
    )
}

export default Subscribe
