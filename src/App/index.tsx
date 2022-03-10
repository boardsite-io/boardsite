import { locale, Locales, translations } from "language"
import React from "react"
import { IntlProvider } from "react-intl"
import { BrowserRouter } from "react-router-dom"
import ElectronWrapper from "./electron"
import Routes from "./router"
import { Theme } from "./theme"

const App = (): JSX.Element => {
    return (
        <IntlProvider locale={locale} messages={translations[Locales.EN]}>
            <Theme>
                <BrowserRouter>
                    <ElectronWrapper>
                        <Routes />
                    </ElectronWrapper>
                </BrowserRouter>
            </Theme>
        </IntlProvider>
    )
}

export default App
