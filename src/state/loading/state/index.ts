import { subscriptionState } from "state/subscription"
import { GlobalState } from "../../types"
import { LoadingInfo, LoadingState } from "./index.types"

export class Loading implements GlobalState<LoadingState> {
    state: LoadingState = {
        isLoading: false,
        loadingInfo: { messageId: "Loading.ExportingPdf" },
    }

    setState(newState: LoadingState) {
        this.state = newState
    }

    getState(): LoadingState {
        return this.state
    }

    startLoading(loadingInfo: LoadingInfo): void {
        this.setState({ isLoading: true, loadingInfo })
        subscriptionState.render("Loading")
    }

    endLoading(): void {
        this.state.isLoading = false
        subscriptionState.render("Loading")
    }
}

export const loading = new Loading()
