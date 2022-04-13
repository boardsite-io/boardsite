// theme.ts
import { DefaultTheme } from "styled-components"

export const candyTheme: DefaultTheme = {
    palette: {
        primary: {
            main: "#F8BBD0",
            contrastText: "#212121",
        },
        secondary: {
            main: "#F48FB1",
            contrastText: "#212121",
        },
        editor: {
            background: "#FCE4EC",
            paper: "#f9fbff",
            selected: "#F06292",
        },
        common: {
            warning: "#ff0000",
            rule: "#880E4F44",
        },
    },
}
