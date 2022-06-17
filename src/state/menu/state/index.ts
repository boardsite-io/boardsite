import { subscriptionState } from "state/subscription"
import { GlobalState } from "state/types"
import { DialogState, MainMenuState, MenuState } from "./index.types"

export class Menu implements GlobalState<MenuState> {
    state: MenuState = {
        mainMenuState: MainMenuState.Closed,
        dialogState: DialogState.Closed,
        shortcutsOpen: false,
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
        const { mainMenuState, shortcutsOpen, dialogState } = this.getState()
        return (
            mainMenuState !== MainMenuState.Closed ||
            dialogState !== DialogState.Closed ||
            shortcutsOpen
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
}

export const menu = new Menu()
