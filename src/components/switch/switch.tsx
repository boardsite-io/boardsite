import React from "react"
import { StyledSwitch, SwitchRail, SwitchThumb } from "./switch.styled"

interface SwitchProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    enabled: boolean
}

const Switch: React.FC<SwitchProps> = (switchProps) => {
    const { enabled } = switchProps
    const props = { ...switchProps, $enabled: enabled }
    return (
        <StyledSwitch {...props}>
            <SwitchRail $enabled={enabled} />
            <SwitchThumb $enabled={enabled} />
        </StyledSwitch>
    )
}

export default Switch
