import { locale, Locales, translations } from "language"
import React from "react"
import { IntlProvider } from "react-intl"
import { BrowserRouter } from "react-router-dom"
import { ThemeProvider } from "styled-components"
import { lightTheme } from "theme/light"
import ElectronWrapper from "./electron"
import Routes from "./router"
import { GlobalStyles } from "./global.styled"

const App = (): JSX.Element => {
    const [theme, setTheme] = React.useState(lightTheme)

    return (
        <IntlProvider locale={locale} messages={translations[Locales.EN]}>
            <ThemeProvider theme={theme}>
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
