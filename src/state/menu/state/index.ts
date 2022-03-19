import { subscriptionState } from "state/subscription"
import { GlobalState } from "../../types"
import { DialogState, MainMenuState, MenuState } from "./index.types"

export class Menu implements GlobalState<MenuState> {
    state: MenuState = {
        mainMenuState: MainMenuState.Closed,
        dialogState: DialogState.InitialSelectionFirstLoad,
        shortcutsOpen: false,
        subscribeOpen: false,
    }

    getState(): MenuState {
        return this.state
    }

    setState(newState: MenuState) {
        this.state = newState
    }

    setSessionDialog(dialogState: DialogState): void {
        this.state.dialogState = dialogState
        subscriptionState.render("DialogState")
    }

    setMainMenu(newState: MainMenuState): void {
        this.state.mainMenuState = newState
        subscriptionState.render("MainMenu")
    }

    closeMainMenu() {
        this.setMainMenu(MainMenuState.Closed)
    }

    openShortcuts() {
        this.state.shortcutsOpen = true
        subscriptionState.render("ShortcutsOpen")
    }

    closeShortcuts() {
        this.state.shortcutsOpen = false
        subscriptionState.render("ShortcutsOpen")
    }

    openSubscribe() {
        this.state.subscribeOpen = true
        subscriptionState.render("SubscribeOpen")
    }

    closeSubscribe() {
        this.state.subscribeOpen = false
        subscriptionState.render("SubscribeOpen")
    }
}

export const menu = new Menu()
