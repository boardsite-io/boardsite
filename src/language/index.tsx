import React, { ReactNode } from "react"
import { Props as ReactIntlFormattedMessageProps } from "react-intl/src/components/message"
import {
    FormattedMessage as ReactIntlFormattedMessage,
    useIntl as useReactIntl,
    IntlFormatters,
} from "react-intl"

// languages
import langEN from "./en.json"
// import langDE from "./de.json"

// The arguments to the original formatMessage function.
type FormatMessageArgs = Parameters<IntlFormatters["formatMessage"]>

// Our new union type of all available message IDs.
type IntlMessageKeys = keyof typeof langEN

// Extend the original FormattedMessage props.
type FormattedMessageProps = ReactIntlFormattedMessageProps<
    Record<string, ReactNode>
> & {
    id?: IntlMessageKeys
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({
    id,
    ...rest
}) => {
    return <ReactIntlFormattedMessage id={id} {...rest} />
}

export const useIntl = (): object => {
    // Pull out the original formatMessage function.
    const { formatMessage, ...rest } = useReactIntl()

    // Re-write the formatMessage function but with a strongly-typed id.
    const typedFormatMessage = (
        descriptor: FormatMessageArgs[0] & {
            id?: IntlMessageKeys
        },
        values?: FormatMessageArgs[1],
        options?: FormatMessageArgs[2]
    ) => {
        return formatMessage(descriptor, values, options)
    }

    return {
        ...rest,
        formatMessage: typedFormatMessage,
    }
}

export enum Locales {
    EN = "en",
    // DE = "de",
}
export const translations = {
    [Locales.EN]: langEN,
    // [Locales.DE]: langDe,
}

// Default to EN for now
export const locale = Locales.EN // navigator.language.split(/[-_]/)[0] // language without region code
