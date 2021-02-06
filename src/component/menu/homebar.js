import React from "react"
import GroupAddIcon from "@material-ui/icons/GroupAdd"
// import SaveIcon from "@material-ui/icons/Save"
// import GetAppIcon from "@material-ui/icons/GetApp"
import { IconButton } from "@material-ui/core"
import Tooltip from "@material-ui/core/Tooltip"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import AddIcon from "@material-ui/icons/Add"
// import RemoveIcon from "@material-ui/icons/Remove"
import { handleAddPage, handleDeleteAllPages } from "../board/requestHandlers"

export default function Homebar(props) {
    // console.log("Homebar Redraw")
    return (
        <div className="homebar">
            <Tooltip
                id="tooltip"
                title="join or create session"
                TransitionProps={{ timeout: 0 }}
                placement="right">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={() => props.setOpenSessionDialog(true)}>
                    <GroupAddIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            {/* <Tooltip
                id="tooltip"
                title="save"
                TransitionProps={{ timeout: 0 }}
                placement="right">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={}>
                    <SaveIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip> */}
            {/* <Tooltip
                id="tooltip"
                title="export to PDF"
                TransitionProps={{ timeout: 0 }}
                placement="right">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={}>
                    <GetAppIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip> */}
            <Tooltip
                id="tooltip"
                title="delete all pages"
                TransitionProps={{ timeout: 0 }}
                placement="right">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={handleDeleteAllPages}>
                    <DeleteForeverIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            <Tooltip
                id="tooltip"
                title="append page"
                TransitionProps={{ timeout: 0 }}
                placement="right">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={handleAddPage}>
                    <AddIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            {/*
            <Tooltip
                id="tooltip"
                title="delete last page"
                TransitionProps={{ timeout: 0 }}
                placement="right">
                <IconButton
                    id="iconButton"
                    variant="contained"
                    onClick={() => props.deletePage()}>
                    <RemoveIcon id="iconButtonInner" />
                </IconButton>
            </Tooltip>
            */}
        </div>
    )
}
