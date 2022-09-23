import { createGlobalStyle, css } from "styled-components"

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
        }
    `}
`

export default GlobalStyles
