import { subscriptionState } from "state/subscription"
import { Theme } from "theme"
import { GlobalState } from "../../types"
import { SettingsSerializer } from "../serializers"
import { SettingsState } from "./index.types"

export class SettingsClass
    extends SettingsSerializer
    implements GlobalState<SettingsState>
{
    constructor(state?: SettingsState) {
        super()
        if (!state) return
        this.setState(state)
    }

    getState(): SettingsState {
        return this.state
    }

    setState(newState: SettingsState): void {
        this.state = newState
        subscriptionState.render("Theme", "Settings")
        this.saveToLocalStorage()
    }

    override async loadFromLocalStorage(): Promise<SettingsState> {
        const state = await super.loadFromLocalStorage()
        subscriptionState.render("Theme", "Settings")
        return state
    }

    /**
     * Get the current theme
     * @returns the current theme
     */
    getTheme(): Theme {
        return this.state.theme
    }

    /**
     * Set the global theme
     * @param theme new theme to be set
     */
    setTheme(theme: Theme) {
        this.state.theme = theme
        subscriptionState.render("Theme")
        this.saveToLocalStorage()
    }

    /**
     * Toggle keep view centered setting
     */
    toggleShouldCenter(): void {
        this.state.keepCentered = !this.state.keepCentered
        subscriptionState.render("Settings")
        this.saveToLocalStorage()
    }

    /**
     * Toggle direct draw setting
     */
    toggleDirectDraw() {
        this.state.directDraw = !this.state.directDraw
        subscriptionState.render("Settings")
        this.saveToLocalStorage()
    }
}

export const settings = new SettingsClass()
