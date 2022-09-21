import styled, { css } from "styled-components"
import { HexColorPicker } from "react-colorful"

export const CustomColorPicker = styled(HexColorPicker)`
    ${({ theme }) => css`
        /* Override the 200px height and width */
        width: auto !important;
        height: auto !important;
        flex-grow: 1;

        .react-colorful__saturation-pointer,
        .react-colorful__alpha-pointer,
        .react-colorful__hue-pointer {
            border: 2px solid;
            border-color: ${theme.palette.primary.contrastText};
        }

        .react-colorful__saturation-pointer,
        .react-colorful__alpha-pointer {
            width: ${theme.colorPicker.hue.width};
            height: ${theme.colorPicker.hue.width};
            border-radius: 50%;
        }

        .react-colorful__hue-pointer {
            width: ${theme.colorPicker.hue.width};
            height: ${theme.colorPicker.hue.height};
            border-radius: calc(${theme.colorPicker.hue.width} / 2);
        }

        .react-colorful__hue {
            height: ${theme.colorPicker.hue.height};
            border-radius: 0 0 ${theme.borderRadius} ${theme.borderRadius};
            &:active {
                /* override component style */
                height: ${theme.colorPicker.hue.height};
            }
        }
    `}
`
