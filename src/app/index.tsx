import { locale, Locales, translations } from "language"
import React from "react"
import { IntlProvider } from "react-intl"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import store from "redux/store"
import ElectronWrapper from "./electron"
import Routes from "./routes"
import { Theme } from "./theme"

const App = (): JSX.Element => {
    return (
        <IntlProvider locale={locale} messages={translations[Locales.EN]}>
            <Theme>
                <Provider store={store}>
                    <BrowserRouter>
                        <ElectronWrapper>
                            <Routes />
                        </ElectronWrapper>
                    </BrowserRouter>
                </Provider>
            </Theme>
        </IntlProvider>
    )
}

export default App
