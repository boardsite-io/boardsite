import { GlobalState, RenderTrigger } from "../../index.types"
import {
    MainMenuState,
    MainSubMenuState,
    MenuState,
    MenuSubscribers,
    MenuSubscription,
} from "./index.types"

export class Menu implements GlobalState<MenuState, MenuSubscribers> {
    state: MenuState = {
        mainMenuState: MainMenuState.Closed,
        mainSubMenuState: MainSubMenuState.Closed,
        shortcutsOpen: false,
    }

    subscribers: MenuSubscribers = {
        mainMenu: [],
        mainSubMenu: [],
        shortcutsOpen: [],
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

    setMainSubMenu(newState: MainSubMenuState): void {
        this.state.mainSubMenuState = newState
        this.render("mainSubMenu")
    }

    closeMainMenu() {
        this.setMainMenu(MainMenuState.Closed)
        this.setMainSubMenu(MainSubMenuState.Closed)
        this.render("mainSubMenu")
    }

    openShortcuts() {
        this.state.shortcutsOpen = true
        this.render("shortcutsOpen")
    }

    closeShortcuts() {
        this.state.shortcutsOpen = false
        this.render("shortcutsOpen")
    }

    subscribe(trigger: RenderTrigger, subscription: MenuSubscription) {
        if (this.subscribers[subscription].indexOf(trigger) > -1) return
        this.subscribers[subscription].push(trigger)
    }

    unsubscribe(trigger: RenderTrigger, subscription: MenuSubscription) {
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
