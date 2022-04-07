import styled from "styled-components"
import { HexColorPicker } from "react-colorful"

export const CustomColorPicker = styled(HexColorPicker)`
    /* Override the 200px height and width */
    width: auto !important;
    height: auto !important;
    flex-grow: 1;

    .react-colorful__saturation-pointer,
    .react-colorful__alpha-pointer,
    .react-colorful__hue-pointer {
        border: 2px solid;
        border-color: ${({ theme }) => theme.palette.primary.contrastText};
    }

    .react-colorful__saturation-pointer,
    .react-colorful__alpha-pointer {
        width: var(--style-picker-hue-width);
        height: var(--style-picker-hue-width);
        border-radius: 50%;
    }

    .react-colorful__hue-pointer {
        width: var(--style-picker-hue-width);
        height: var(--style-picker-hue-height);
        border-radius: calc(var(--style-picker-hue-width) / 2);
    }

    .react-colorful__hue {
        height: var(--style-picker-hue-height);
        border-radius: 0 0 var(--border-radius) var(--border-radius);
        &:active {
            /* override component style */
            height: var(--style-picker-hue-height);
        }
    }
`
