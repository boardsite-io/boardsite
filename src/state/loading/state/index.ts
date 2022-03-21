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
    }

    startLoading(messageId: IntlMessageId): void {
        this.setState({ isLoading: true, messageId })
        subscriptionState.render("Loading")
    }

    endLoading(): void {
        this.state.isLoading = false
        subscriptionState.render("Loading")
    }
}

export const loading = new Loading()
