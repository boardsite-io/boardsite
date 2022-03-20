import { Session, User } from "api/types"
import { validateToken } from "api/auth"
import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { subscriptionState } from "state/subscription"
import { getRandomColor } from "helpers"
import {
    adjectives,
    animals,
    uniqueNamesGenerator,
} from "unique-names-generator"
import { OnlineState } from "./index.types"
import { GlobalState, SerializedState } from "../../types"
import { DrawingState } from "../../drawing/state/index.types"
import { deserializeOnlineToken, serializeOnlineState } from "../serializers"

export class Online implements GlobalState<OnlineState> {
    state: OnlineState = {
        userSelection: {
            alias: uniqueNamesGenerator({
                dictionaries: [adjectives, animals],
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

    getState(): OnlineState {
        return this.state
    }

    setState(newState: OnlineState): void {
        this.state = newState
    }

    newSession(session: Session): void {
        this.state.session = session
        this.state.session.setToken(this.state.token ?? "")
        subscriptionState.render("Session")
        this.saveToLocalStorage()
    }

    updateUser(user: Partial<User>): void {
        this.state.userSelection = {
            ...this.state.userSelection,
            ...user,
        }
        this.saveToLocalStorage()
    }

    async setToken(token: string): Promise<void> {
        this.state.session?.setToken(token)
        this.state.token = token
        const isAuthorized = await validateToken(token)
        this.state.isAuthorized = () => isAuthorized
        subscriptionState.render("Session")
        this.saveToLocalStorage()
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
}

export const online = new Online()
