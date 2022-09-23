// theme.ts
import { DefaultTheme } from "styled-components"
import { baseTheme } from "theme/baseTheme"

export const oceanTheme: DefaultTheme = {
    ...baseTheme,
    palette: {
        primary: {
            main: "#1A237E",
            contrastText: "#E0E0E0",
        },
        secondary: {
            main: "#283593",
            contrastText: "#FAFAFA",
        },
        editor: {
            background: "#3F51B5",
            paper: "#f9fbff",
            selected: "#3949AB",
        },
        common: {
            warning: "#ff0000",
            rule: "#E0F7FA55",
        },
    },
}
