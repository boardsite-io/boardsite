import React from "react"
import { useGState } from "state"
import { ThemeProvider } from "styled-components"
import GlobalStyles from "./globalStyles"
import { themes } from "./themes"

const Theme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme: currentTheme } = useGState("Theme").settings

    return (
        <ThemeProvider theme={themes[currentTheme]}>
            <GlobalStyles />
            {children}
        </ThemeProvider>
    )
}

export default Theme
