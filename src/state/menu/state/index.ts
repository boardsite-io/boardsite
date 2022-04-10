import { subscriptionState } from "state/subscription"
import { GlobalState } from "../../types"
import { DialogState, MainMenuState, MenuState } from "./index.types"

export class Menu implements GlobalState<MenuState> {
    state: MenuState = {
        mainMenuState: MainMenuState.Closed,
        dialogState: DialogState.Closed,
        shortcutsOpen: false,
        subscribeOpen: false,
    }

    getState(): MenuState {
        return this.state
    }

    setState(newState: MenuState) {
        this.state = newState
        return this
    }

    /**
     * Check if any menu / dialog is open
     * @returns true if any menu or dialog is open
     */
    isAnyMenuOpen() {
        const { mainMenuState, shortcutsOpen, subscribeOpen, dialogState } =
            this.getState()
        return (
            mainMenuState !== MainMenuState.Closed ||
            dialogState !== DialogState.Closed ||
            shortcutsOpen ||
            subscribeOpen
        )
    }

    /**
     * Set the session dialog state
     * @param dialogState new dialog state
     */
    setDialogState(dialogState: DialogState): void {
        this.state.dialogState = dialogState
        subscriptionState.render("DialogState")
    }

    /**
     * Set the main menu state
     * @param newState new main menu state
     */
    setMainMenu(newState: MainMenuState): void {
        this.state.mainMenuState = newState
        subscriptionState.render("MainMenu")
    }

    /**
     * Close the main menu
     */
    closeMainMenu() {
        this.setMainMenu(MainMenuState.Closed)
    }

    /**
     * Open the shortcuts overview
     */
    openShortcuts() {
        this.state.shortcutsOpen = true
        subscriptionState.render("ShortcutsOpen")
    }

    /**
     * Close the shortcuts overview
     */
    closeShortcuts() {
        this.state.shortcutsOpen = false
        subscriptionState.render("ShortcutsOpen")
    }

    /**
     * Open the subscription dialog
     */
    openSubscribe() {
        this.state.subscribeOpen = true
        subscriptionState.render("SubscribeOpen")
    }

    /**
     * Close the subscription dialog
     */
    closeSubscribe() {
        this.state.subscribeOpen = false
        subscriptionState.render("SubscribeOpen")
    }
}

export const menu = new Menu()
