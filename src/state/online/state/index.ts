import { Session } from "api/types"
import {
    DialogState,
    OnlineState,
    OnlineSubscribers,
    OnlineSubscription,
} from "./index.types"
import { GlobalState, RenderTrigger } from "../../index.types"

export class Online implements GlobalState<OnlineState, OnlineSubscribers> {
    state: OnlineState = {
        dialogState: DialogState.InitialSelectionFirstLoad,
    }

    subscribers: OnlineSubscribers = { session: [] }

    getState(): OnlineState {
        return this.state
    }

    setState(newState: OnlineState): void {
        this.state = newState
    }

    setSessionDialog(dialogState: DialogState): void {
        this.state.dialogState = dialogState
        this.render("session")
    }

    setSession(session: Session): void {
        this.state.session = session
        this.render("session")
    }

    subscribe(trigger: RenderTrigger, subscription: OnlineSubscription) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(trigger: RenderTrigger, subscription: OnlineSubscription) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(subscription: OnlineSubscription): void {
        this.subscribers[subscription].forEach((render) => {
            render({})
        })
    }
}

export const online = new Online()
