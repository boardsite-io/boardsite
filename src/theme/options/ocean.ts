// theme.ts
import { DefaultTheme } from "styled-components"

export const oceanTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#1565C0",
            contrastText: "#E0E0E0",
        },
        secondary: {
            main: "#0D47A1",
            contrastText: "#E1F5FE",
        },
        editor: {
            background: "#90CAF9",
            paper: "#f9fbff",
            selected: "#0288D1",
        },
        common: {
            warning: "#ff0000",
            rule: "#E0F7FA55",
        },
    },
}
