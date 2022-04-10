import { IntlMessageId } from "language"
import { subscriptionState } from "state/subscription"
import { GlobalState } from "../../types"
import { LoadingState } from "./index.types"

export class Loading implements GlobalState<LoadingState> {
    state: LoadingState = {
        isLoading: false,
        messageId: "Loading.ExportingPdf",
    }

    getState(): LoadingState {
        return this.state
    }

    setState(newState: LoadingState) {
        this.state = newState
        return this
    }

    /**
     * Open a dialog with a loading animation and a specified text
     * @param messageId intl message id of the loading text
     */
    startLoading(messageId: IntlMessageId): void {
        this.setState({ isLoading: true, messageId })
        subscriptionState.render("Loading")
    }

    /**
     * Close the loading dialog
     */
    endLoading(): void {
        this.state.isLoading = false
        subscriptionState.render("Loading")
    }
}

export const loading = new Loading()
