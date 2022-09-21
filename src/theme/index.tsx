import React from "react"
import { useGState } from "state"
import { ThemeProvider } from "styled-components"
import { themes } from "./themes"

const Theme: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { theme: currentTheme } = useGState("Theme").settings

    return (
        <ThemeProvider theme={themes[currentTheme]}>{children}</ThemeProvider>
    )
}

export default Theme
