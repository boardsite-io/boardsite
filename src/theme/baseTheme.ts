import { DefaultTheme } from "styled-components"

export const baseTheme: Omit<DefaultTheme, "palette"> = {
    breakpoint: {
        sm: "576px",
        md: "768px",
        lg: "992px",
        xl: "1200px",
        xxl: "1400px",
    },
}
