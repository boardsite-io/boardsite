import styled, { css } from "styled-components"
import { Position, ToolTipBoxProps } from "./index.types"

export const Wrapper = styled.div`
    position: relative;
`

export const HoverTrigger = styled.div`
    #tooltip {
        transition: all 300ms ease-in-out;
        opacity: 0;
    }

    &:hover {
        #tooltip {
            opacity: 1;
        }
    }
`

export const ToolTipBox = styled.div<ToolTipBoxProps>`
    ${({ theme, ...props }) => css`
        z-index: ${theme.zIndex.toolTip};
        line-break: none;
        position: absolute;
        pointer-events: none;
        color: ${theme.palette.primary.contrastText};
        background: ${theme.palette.primary.main};
        box-shadow: ${theme.boxShadow};
        padding: 0.4rem 0.6rem;
        border-radius: ${theme.borderRadius};
        ${getPosition(props)}
    `}
`

export const ToolTipText = styled.p`
    white-space: nowrap;
    margin: 0;
`

const getPosition = (props: ToolTipBoxProps) => {
    const distance = "1rem"

    switch (props.position) {
        case Position.TopLeft:
            return css`
                bottom: 100%;
                margin-bottom: ${distance};
                right: 0;
            `
        case Position.Top:
            return css`
                left: 50%;
                transform: translateX(-50%);
                bottom: 100%;
                margin-bottom: ${distance};
            `
        case Position.TopRight:
            return css`
                left: 0;
                bottom: 100%;
                margin-bottom: ${distance};
            `
        case Position.Right:
            return css`
                top: 50%;
                left: 100%;
                margin-left: ${distance};
                transform: translateY(-50%);
            `
        case Position.BottomRight:
            return css`
                top: 100%;
                margin-top: ${distance};
            `
        case Position.Bottom:
            return css`
                top: 100%;
                margin-top: ${distance};
                left: 50%;
                transform: translateX(-50%);
            `
        case Position.BottomLeft:
            return css`
                top: 100%;
                margin-top: ${distance};
                right: 0;
            `
        case Position.Left:
            return css`
                top: 50%;
                right: 100%;
                margin-right: ${distance};
                transform: translateY(-50%);
            `
        default:
            return null
    }
}
