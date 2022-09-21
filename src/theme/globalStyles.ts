import { createGlobalStyle, css } from "styled-components"

export const SELECTION_FILL = "#00a2ff38"
export const ERASER_STROKE = "#77110511"

const GlobalStyles = createGlobalStyle`
    ${({ theme }) => css`
        body {
            /* --- Font --- */
            font-family: "Lato", sans-serif;
            font-size: 16px;
            font-weight: 400;

            body,
            input,
            button,
            select,
            textarea,
            ul,
            li {
                font-family: inherit;
                font-size: inherit;
                font-weight: inherit;
            }

            /* --- Color --- */
            color: ${theme.palette.primary.contrastText};

            svg:not(.external-icon) {
                stroke: ${theme.palette.primary.contrastText};
                stroke-width: ${theme.iconButton.strokeWidth};
            }

            /* --- Selection Tool --- */
            --sel-color: ${SELECTION_FILL};
            --sel-handle-color: #00245366;
            --sel-handle-size: 0.75rem;
            --sel-handle-border-radius: 2px;
        }
    `}
`

export default GlobalStyles
