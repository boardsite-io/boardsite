import { locale, Locales, translations } from "language"
import React, { useCallback, useEffect, useState } from "react"
import { IntlProvider } from "react-intl"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import { settings } from "state/settings"
import { drawing } from "state/drawing"
import { online } from "state/online"
import { view } from "state/view"
import { useGState } from "state"
import { themes } from "theme"
import ElectronWrapper from "./electron"
import Routes from "./router"
import { GlobalStyles } from "./global.styled"

const App = () => {
    const [loading, setLoading] = useState(true)
    const { theme: currentTheme } = useGState("Theme").settings

    const loadLocalStates = useCallback(async () => {
        await Promise.all([
            drawing.loadFromLocalStorage(),
            online.loadFromLocalStorage(),
            settings.loadFromLocalStorage(),
            view.loadFromLocalStorage(),
        ])
        setLoading(false)
    }, [])

    useEffect(() => {
        loadLocalStates()
    }, [loadLocalStates])

    // Wait for localStorage load to complete to prevent
    // switching theme on mount which looks horrendous
    if (loading) return null

    return (
        <IntlProvider locale={locale} messages={translations[Locales.EN]}>
            <ThemeProvider theme={themes[currentTheme]}>
                <GlobalStyles>
                    <BrowserRouter>
                        <ElectronWrapper>
                            <Routes />
                        </ElectronWrapper>
                    </BrowserRouter>
                </GlobalStyles>
            </ThemeProvider>
        </IntlProvider>
    )
}

export default App
