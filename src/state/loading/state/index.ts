import { GlobalState, RenderTrigger } from "../../index.types"
import {
    LoadingInfo,
    LoadingState,
    LoadingSubscribers,
    LoadingSubscription,
} from "./index.types"

export class Loading implements GlobalState<LoadingState, LoadingSubscribers> {
    state: LoadingState = {
        isLoading: false,
        loadingInfo: { messageId: "Loading.ExportingPdf" },
    }

    subscribers: LoadingSubscribers = { loading: [] }

    setState(newState: LoadingState) {
        this.state = newState
    }

    getState(): LoadingState {
        return this.state
    }

    startLoading(loadingInfo: LoadingInfo): void {
        this.setState({ isLoading: true, loadingInfo })
        this.render("loading")
    }

    endLoading(): void {
        this.state.isLoading = false
        this.render("loading")
    }

    subscribe(subscription: LoadingSubscription, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(subscription: LoadingSubscription, trigger: RenderTrigger) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(subscription: LoadingSubscription): void {
        this.subscribers[subscription].forEach((render) => {
            render({})
        })
    }
}

export const loading = new Loading()
