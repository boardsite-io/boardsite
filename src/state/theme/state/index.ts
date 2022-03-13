import { loadLocalStorage, saveLocalStorage } from "storage/local"
import { Theme } from "theme"
import { GlobalState, RenderTrigger, SerializedState } from "../../index.types"
import { deserializeThemeState, serializeThemeState } from "../serializers"
import { ThemeState, ThemeSubscribers, ThemeSubscription } from "./index.types"

export class ThemeClass implements GlobalState<ThemeState, ThemeSubscribers> {
    state: ThemeState = {
        theme: Theme.Light,
    }

    subscribers: ThemeSubscribers = { theme: [] }

    getTheme(): Theme {
        return this.state.theme
    }

    setTheme(theme: Theme) {
        this.state.theme = theme
        this.render("theme")
        this.saveToLocalStorage()
    }

    getSerializedState(): SerializedState<ThemeState> {
        return serializeThemeState(this.getState())
    }

    async setSerializedState(
        serializedThemeState: SerializedState<ThemeState>
    ): Promise<void> {
        try {
            const state = await deserializeThemeState(serializedThemeState)
            this.setState(state)
        } catch (error) {
            // Theme could not be deserialized, stick to default
        }
    }

    saveToLocalStorage(): void {
        saveLocalStorage("theme", this.getSerializedState())
    }

    async loadFromLocalStorage(): Promise<void> {
        const serializedState = await loadLocalStorage("theme")
        if (serializedState === null) return
        await this.setSerializedState(serializedState)
    }

    getState(): ThemeState {
        return this.state
    }

    setState(newState: ThemeState): void {
        this.state = newState
        this.render("theme")
    }

    subscribe(subscription: ThemeSubscription, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(subscription: ThemeSubscription, trigger: RenderTrigger) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(subscription: ThemeSubscription): void {
        this.subscribers[subscription].forEach((render) => {
            render({})
        })
    }
}

export const theme = new ThemeClass()
