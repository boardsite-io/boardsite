// theme.ts
import { DefaultTheme } from "styled-components"

export const orangeTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#F57C00",
            contrastText: "#E0F7FA",
        },
        secondary: {
            main: "#E65100",
            contrastText: "#E0F7FA",
        },
        editor: {
            background: "#FFCC80",
            paper: "#f9fbff",
            selected: "#F4511E",
        },
        common: {
            warning: "#ff0000",
            rule: "#E0F7FA88",
        },
    },
}
