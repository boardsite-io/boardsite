import { Session } from "api/types"
import { DialogState, OnlineState } from "./index.types"
import { GlobalState, RenderTrigger, Subscribers } from "../../index.types"

export class Online implements GlobalState<OnlineState> {
    state: OnlineState = {
        dialogState: DialogState.InitialSelectionFirstLoad,
    }

    subscribers: Subscribers = []

    getState(): OnlineState {
        return this.state
    }

    setState(newState: OnlineState): void {
        this.state = newState
    }

    setSessionDialog(dialogState: DialogState): void {
        this.state.dialogState = dialogState
        this.render()
    }

    setSession(session: Session): void {
        this.state.session = session
        this.render()
    }

    subscribe(trigger: RenderTrigger) {
        if (this.subscribers.indexOf(trigger) > -1) return
        this.subscribers.push(trigger)
    }

    unsubscribe(trigger: RenderTrigger) {
        this.subscribers = this.subscribers.filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(): void {
        this.subscribers?.forEach((trigger) => {
            trigger({})
        })
    }
}

export const online = new Online()
