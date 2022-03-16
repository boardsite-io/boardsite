import { subscriptionState } from "state/subscription"
import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { Theme } from "theme"
import { GlobalState, SerializedState } from "../../types"
import { deserializeThemeState, serializeThemeState } from "../serializers"
import { getDefaultSettingsState } from "./default"
import { SettingsState } from "./index.types"

export class SettingsClass implements GlobalState<SettingsState> {
    state: SettingsState = getDefaultSettingsState()

    getState(): SettingsState {
        return this.state
    }

    setState(newState: SettingsState): void {
        this.state = newState
        subscriptionState.render("Theme", "Settings")
    }

    getTheme(): Theme {
        return this.state.theme
    }

    setTheme(theme: Theme) {
        this.state.theme = theme
        subscriptionState.render("Theme")
    }

    toggleShouldCenter(): void {
        this.state.keepCentered = !this.state.keepCentered
        subscriptionState.render("Settings")
    }

    toggleDirectDraw() {
        this.state.directDraw = !this.state.directDraw
        subscriptionState.render("Settings")
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
}

export const settings = new SettingsClass()
