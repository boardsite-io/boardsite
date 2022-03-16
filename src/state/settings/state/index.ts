import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { Theme } from "theme"
import { GlobalState, RenderTrigger, SerializedState } from "../../index.types"
import { deserializeThemeState, serializeThemeState } from "../serializers"
import { getDefaultSettingsState } from "./default"
import {
    SettingsState,
    SettingsSubscribers,
    SettingsSubscription,
} from "./index.types"

export class SettingsClass
    implements GlobalState<SettingsState, SettingsSubscribers>
{
    state: SettingsState = getDefaultSettingsState()

    subscribers: SettingsSubscribers = { theme: [], settings: [] }

    getTheme(): Theme {
        return this.state.theme
    }

    setTheme(theme: Theme) {
        this.state.theme = theme
        this.render("theme")
    }

    toggleShouldCenter(): void {
        this.state.keepCentered = !this.state.keepCentered
        this.render("settings")
    }

    toggleDirectDraw() {
        this.state.directDraw = !this.state.directDraw
        this.render("settings")
    }

    getSerializedState(): SerializedState<SettingsState> {
        return serializeThemeState(this.getState())
    }

    async setSerializedState(
        serializedThemeState: SerializedState<SettingsState>
    ): Promise<void> {
        try {
            const state = await deserializeThemeState(serializedThemeState)
            this.setState(state)
        } catch (error) {
            // Theme could not be deserialized, stick to default
        }
    }

    saveToLocalStorage(): void {
        saveLocalStorage("settings", this.getSerializedState())
    }

    async loadFromLocalStorage(): Promise<void> {
        const serializedState = await loadLocalStorage("settings")
        if (serializedState === null) return
        await this.setSerializedState(serializedState)
    }

    getState(): SettingsState {
        return this.state
    }

    setState(newState: SettingsState): void {
        this.state = newState
        this.render("theme", "settings")
    }

    subscribe(subscription: SettingsSubscription, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(subscription: SettingsSubscription, trigger: RenderTrigger) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(...subscriptions: SettingsSubscription[]): void {
        subscriptions.forEach((subscription) => {
            this.subscribers[subscription].forEach((render) => {
                render({})
            })
        })
        this.saveToLocalStorage() // Always save settings changes to localStorage
    }
}

export const settings = new SettingsClass()
