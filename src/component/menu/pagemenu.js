import React, { useState } from "react"
import { IconButton } from "@material-ui/core"
import ClearIcon from "@material-ui/icons/Clear"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"
import Tooltip from "@material-ui/core/Tooltip"
import MenuIcon from "@material-ui/icons/Menu"

import { addPage, clearPage, deletePage } from "../board/page.js"

/**
 * 
 * @param {{pageId: string}} props 
 */
export default function PageMenu(props) {
    const [displayPageSettings, setDisplayPageSettings] = useState(false)

    function openPageSettings() {
        setDisplayPageSettings(true)
    }

    function closePageSettings() {
        setDisplayPageSettings(false)
    }

    return (
        <div>
            <Tooltip
                id="tooltip"
                title="page settings"
                TransitionProps={{ timeout: 0 }}
                placement="bottom">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={openPageSettings}>
                    <MenuIcon color="secondary" id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            {
                // Palette Popup
                displayPageSettings ? (
                    <div className="pagesettingspopup">
                        <div className="cover" onClick={closePageSettings} />
                        <div className="pagesettings">
                            <Tooltip
                                id="tooltip"
                                title="clear Page"
                                TransitionProps={{ timeout: 0 }}
                                placement="left">
                                <IconButton
                                    id="iconButton"
                                    variant="contained"
                                    onClick={() => {
                                        clearPage(props.pageId)
                                        closePageSettings()
                                    }}>
                                    <ClearIcon
                                        color="secondary"
                                        id="iconButtonInner"
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                id="tooltip"
                                title="add page"
                                TransitionProps={{ timeout: 0 }}
                                placement="left">
                                <IconButton
                                    id="iconButton"
                                    variant="contained"
                                    onClick={() => {
                                        addPage(props.pageId)
                                        closePageSettings()
                                    }}>
                                    <AddIcon
                                        color="secondary"
                                        id="iconButtonInner"
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip
                                id="tooltip"
                                title="delete page"
                                TransitionProps={{ timeout: 0 }}
                                placement="left">
                                <IconButton
                                    id="iconButton"
                                    variant="contained"
                                    onClick={() => {
                                        deletePage(props.pageId)
                                        closePageSettings()
                                    }}>
                                    <RemoveIcon
                                        color="secondary"
                                        id="iconButtonInner"
                                    />
                                </IconButton>
                            </Tooltip>
                        </div>
                    </div>
                ) : null
            }
        </div>
    )
}
