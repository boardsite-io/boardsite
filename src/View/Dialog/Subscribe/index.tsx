import React from "react"
import { FormattedMessage } from "language"
import { DialogContent, DialogTitle, TickIcon } from "components"
import { AUTH_URL } from "api/auth"
import { FaInfinity } from "react-icons/fa"
import { BenefitItem, BenefitList, SubscribeButton } from "./index.styled"

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
    return (
        <>
            <DialogTitle>
                <FormattedMessage id="Dialog.Sponsor.Title" />
            </DialogTitle>
            <DialogContent>
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
            </DialogContent>
        </>
    )
}

export default Subscribe
