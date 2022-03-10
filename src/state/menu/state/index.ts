import { GlobalState, RenderTrigger } from "../../index.types"
import {
    MainMenuState,
    MenuState,
    MenuSubscribers,
    MenuSubscription,
} from "./index.types"

export class Menu implements GlobalState<MenuState, MenuSubscribers> {
    state: MenuState = {
        mainMenuState: MainMenuState.Closed,
        shortcutsOpen: false,
        subscribeOpen: false,
    }

    subscribers: MenuSubscribers = {
        mainMenu: [],
        shortcutsOpen: [],
        subscribeOpen: [],
    }

    setState(newState: MenuState) {
        this.state = newState
    }

    getState(): MenuState {
        return this.state
    }

    setMainMenu(newState: MainMenuState): void {
        this.state.mainMenuState = newState
        this.render("mainMenu")
    }

    closeMainMenu() {
        this.setMainMenu(MainMenuState.Closed)
    }

    openShortcuts() {
        this.state.shortcutsOpen = true
        this.render("shortcutsOpen")
    }

    closeShortcuts() {
        this.state.shortcutsOpen = false
        this.render("shortcutsOpen")
    }

    openSubscribe() {
        this.state.subscribeOpen = true
        this.render("subscribeOpen")
    }

    closeSubscribe() {
        this.state.subscribeOpen = false
        this.render("subscribeOpen")
    }

    subscribe(subscription: MenuSubscription, trigger: RenderTrigger) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(subscription: MenuSubscription, trigger: RenderTrigger) {
        this.subscribers[subscription] = this.subscribers[subscription].filter(
            (subscriber) => subscriber !== trigger
        )
    }

    render(subscription: MenuSubscription): void {
        this.subscribers[subscription].forEach((render) => {
            render({})
        })
    }
}

export const menu = new Menu()
