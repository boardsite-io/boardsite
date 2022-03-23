import { Session, User } from "api/types"
import { validateToken } from "api/auth"
import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { subscriptionState } from "state/subscription"
import { getRandomColor } from "util/color"
import {
    adjectives,
    animals,
    uniqueNamesGenerator,
} from "unique-names-generator"
import { OnlineState } from "./index.types"
import { GlobalState, SerializedState } from "../../types"
import { DrawingState } from "../../drawing/state/index.types"
import { deserializeOnlineState, serializeOnlineState } from "../serializers"

export class Online implements GlobalState<OnlineState> {
    state: OnlineState = {
        user: {
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

    /**
     * Add a new session
     * @param session new session object
     */
    newSession(session: Session): void {
        this.state.session = session
        this.state.session.setToken(this.state.token ?? "")
        this.saveToLocalStorage()
        subscriptionState.render("Session")
    }

    /**
     * Update the user settings, such as alias and color
     * @param user an update to the user selection
     */
    updateUser(user: Partial<User>): void {
        this.state.user = {
            ...this.state.user,
            ...user,
        }
        this.saveToLocalStorage()
    }

    /**
     * Set the github authorization token
     * @param token authorization token
     */
    async setToken(token: string): Promise<void> {
        this.state.session?.setToken(token)
        this.state.token = token
        const isAuthorized = await validateToken(token)
        this.state.isAuthorized = () => isAuthorized
        this.saveToLocalStorage()
        subscriptionState.render("Session")
    }

    /**
     * Clear the github authorization token
     */
    clearToken(): void {
        this.setToken("")
        this.state.session?.clearToken()
        this.saveToLocalStorage()
    }

    getSerializedState(): SerializedState<DrawingState> {
        return serializeOnlineState(this.getState())
    }

    async setSerializedState(
        serializedDrawingState: SerializedState<DrawingState>
    ): Promise<void> {
        const { token, user: userSelection } = await deserializeOnlineState(
            serializedDrawingState
        )

        // Load preferred user settings
        if (userSelection) {
            this.updateUser(userSelection)
        }

        // dont erase an existing token
        if (!token) return
        await this.setToken(token)
    }

    saveToLocalStorage(): void {
        const state = this.getState()
        saveLocalStorage("online", () => serializeOnlineState(state))
    }

    async loadFromLocalStorage(): Promise<void> {
        const serializedState = await loadLocalStorage("online")
        if (serializedState === null) return
        await this.setSerializedState(serializedState)
    }
}

export const online = new Online()
