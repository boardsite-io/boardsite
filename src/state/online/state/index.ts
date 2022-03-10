import { Session, User } from "api/types"
import { validateToken } from "api/auth"
import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { getRandomColor } from "helpers"
import {
    adjectives,
    animals,
    colors,
    uniqueNamesGenerator,
} from "unique-names-generator"
import {
    DialogState,
    OnlineState,
    OnlineSubscribers,
    OnlineSubscription,
} from "./index.types"
import { GlobalState, RenderTrigger, SerializedState } from "../../index.types"
import { DrawingState } from "../../drawing/state/index.types"
import { deserializeOnlineToken, serializeOnlineState } from "../serializers"

export class Online implements GlobalState<OnlineState, OnlineSubscribers> {
    state: OnlineState = {
        dialogState: DialogState.InitialSelectionFirstLoad,
        userSelection: {
            alias: uniqueNamesGenerator({
                dictionaries: [adjectives, colors, animals],
                separator: "",
                style: "capital",
            }),
            color: getRandomColor(),
        },
        isConnected: () =>
            this.state.session !== undefined &&
            this.state.session.isConnected(),
        isAuthorized: () => false,
        isSignedIn: () => !!this.state.token,
    }

    subscribers: OnlineSubscribers = { session: [], userSelection: [] }

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

    newSession(session: Session): void {
        this.state.session = session
        this.state.session.setToken(this.state.token ?? "")
        this.render("session")
    }

    updateUser(user: Partial<User>): void {
        this.state.userSelection = {
            ...this.state.userSelection,
            ...user,
        }
        this.render("userSelection")
    }

    async setToken(token: string): Promise<void> {
        this.state.session?.setToken(token)
        this.state.token = token
        const isAuthorized = await validateToken(token)
        this.state.isAuthorized = () => isAuthorized
        this.render("session")
    }

    clearToken(): void {
        this.setToken("")
    }

    getSerializedState(): SerializedState<DrawingState> {
        return serializeOnlineState(this.getState())
    }

    async setSerializedState(
        serializedDrawingState: SerializedState<DrawingState>
    ): Promise<void> {
        const { token } = await deserializeOnlineToken(serializedDrawingState)
        // dont erase an existing token
        if (!token) return
        await this.setToken(token)
    }

    saveToLocalStorage(): void {
        saveLocalStorage("online", this.getSerializedState())
    }

    async loadFromLocalStorage(): Promise<void> {
        const serializedState = await loadLocalStorage("online")
        if (serializedState === null) return
        await this.setSerializedState(serializedState)
    }

    subscribe(subscription: OnlineSubscription, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(subscription: OnlineSubscription, trigger: RenderTrigger) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(subscription: OnlineSubscription): void {
        this.subscribers[subscription].forEach((render) => {
            render({})
        })

        if (subscription === "session") {
            // Save to local storage on each render
            this.saveToLocalStorage()
        }
    }
}

export const online = new Online()
