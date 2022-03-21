import React from "react"
import { MemoryRouter } from "react-router-dom"
import { IntlProvider } from "react-intl"
import {
    FormatMessageArgs,
    FormattedMessage,
    IntlMessageId,
    locale,
    Locales,
    translations,
} from "language"
import { ThemeProvider } from "styled-components"
import { Theme, themes } from "theme"
import { render } from "@testing-library/react"

type RenderProps = {
    ui: JSX.Element
    pathname?: string
    initRoutes?: string[]
}

export const renderWithProviders = ({
    ui,
    pathname = "/",
    initRoutes = ["/"],
}: RenderProps) => {
    const theme = themes[Theme.Dark]
    const messages = translations[Locales.EN]

    return render(
        <IntlProvider locale={locale} messages={messages}>
            <ThemeProvider theme={theme}>
                <MemoryRouter
                    initialEntries={[...initRoutes, { pathname }]}
                    initialIndex={1}
                >
                    {ui}
                </MemoryRouter>
            </ThemeProvider>
        </IntlProvider>
    )
}

/**
 * Render a formattedMessage to extract its string which also
 * allows testing of a FormattedMessage which uses dynamic values.
 */
export const formatMessage = (
    id: IntlMessageId,
    values?: FormatMessageArgs[1]
) => {
    const messages = translations[Locales.EN]

    const { unmount, getByTestId } = render(
        <IntlProvider locale={locale} messages={messages}>
            <div data-testid="message-container">
                <FormattedMessage id={id} values={values} />
            </div>
        </IntlProvider>
    )

    // Extract text
    const message = getByTestId("message-container").textContent

    // Clean up render
    unmount()
    return message as string // We know here that a string will be found
}
