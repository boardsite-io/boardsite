import styled, { css } from "styled-components"

interface StyledSwitchProps {
    $enabled: boolean
}
export const StyledSwitch = styled.div<StyledSwitchProps>`
    --thumbDiameter: 1.2rem;
    --railHeight: 0.8rem;
    margin: 0.5rem 0.2rem;
    position: relative;
    height: var(--thumbDiameter);
    width: 2rem;
    &:hover {
        cursor: pointer;
        div:last-child {
            box-shadow: 0 0 0.5rem 0 #00000088;
        }
    }
`
const transition = css`
    transition: all 300ms ease-in-out, box-shadow 200ms ease-in-out;
`

export const SwitchThumb = styled.div<StyledSwitchProps>`
    height: var(--thumbDiameter);
    width: var(--thumbDiameter);
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    box-shadow: var(--box-shadow);
    ${({ $enabled }) => ($enabled ? enabledSwitchThumb : disabledSwitchThumb)}
    ${transition}
`
const enabledSwitchThumb = css`
    left: 100%;
    background: var(--color3);
`
const disabledSwitchThumb = css`
    left: 0;
    background: var(--color3);
`

export const SwitchRail = styled.div<StyledSwitchProps>`
    border-radius: calc(0.5 * var(--railHeight));
    height: var(--railHeight);
    background: var(--color4);
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);

    // Enabled rail
    &::before {
        ${transition}
        position: absolute;
        content: "";
        left: 0;
        height: var(--railHeight);
        border-radius: calc(0.5 * var(--railHeight));
        background: var(--color3);
        ${({ $enabled }) =>
            $enabled ? enabledSwitchRail : disabledSwitchRail};
    }
`
const enabledSwitchRail = css`
    width: 100%;
`
const disabledSwitchRail = css`
    width: 0;
`
