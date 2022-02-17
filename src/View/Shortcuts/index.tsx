import { DrawerTitle } from "components"
import { FormattedMessage } from "language"
import React from "react"
import { menu, useMenu } from "state/menu"
import { ShortcutDrawer, ShortcutList } from "./index.styled"
import Shortcut from "./Shortcut"

const Shortcuts = () => {
    const { shortcutsOpen } = useMenu("shortcutsOpen")

    return (
        <ShortcutDrawer
            open={shortcutsOpen}
            onClose={() => menu.closeShortcuts()}
        >
            <DrawerTitle>
                <FormattedMessage id="Shortcuts.Title" />
            </DrawerTitle>
            <ShortcutList>
                <Shortcut
                    titleId="Shortcuts.File.New"
                    keysId="Shortcuts.File.New.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.File.Open"
                    keysId="Shortcuts.File.Open.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.File.Save"
                    keysId="Shortcuts.File.Save.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Undo"
                    keysId="Shortcuts.Undo.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Redo"
                    keysId="Shortcuts.Redo.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Page.AddOver"
                    keysId="Shortcuts.Page.AddOver.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Page.AddUnder"
                    keysId="Shortcuts.Page.AddUnder.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Page.DeleteCurrent"
                    keysId="Shortcuts.Page.DeleteCurrent.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Tool.Active"
                    keysId="Shortcuts.Tool.Active.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Tool.Eraser"
                    keysId="Shortcuts.Tool.Eraser.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Tool.Selection"
                    keysId="Shortcuts.Tool.Selection.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Tool.Panning"
                    keysId="Shortcuts.Tool.Panning.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Tool.Pen"
                    keysId="Shortcuts.Tool.Pen.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Tool.Line"
                    keysId="Shortcuts.Tool.Line.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Tool.Rectangle"
                    keysId="Shortcuts.Tool.Rectangle.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.Tool.Circle"
                    keysId="Shortcuts.Tool.Circle.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.FirstPage"
                    keysId="Shortcuts.FirstPage.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.LastPage"
                    keysId="Shortcuts.LastPage.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.PreviousPage"
                    keysId="Shortcuts.PreviousPage.Keys"
                />
                <Shortcut
                    titleId="Shortcuts.NextPage"
                    keysId="Shortcuts.NextPage.Keys"
                />
            </ShortcutList>
        </ShortcutDrawer>
    )
}
export default Shortcuts
