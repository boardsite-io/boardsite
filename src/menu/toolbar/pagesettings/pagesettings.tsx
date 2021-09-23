import React, { useState } from "react"
import { BsGear } from "react-icons/bs"
import { PageBackground } from "types"
import { handlePageBackground } from "drawing/handlers"
import {
    Button,
    Dialog,
    DialogContent,
    DialogOptions,
    DialogTitle,
    IconButton,
} from "components"
import {
    PageOptions,
    PagePreviewBlank,
    PagePreviewCheckered,
    PagePreviewRuled,
} from "./pagesettings.styled"
import { pageType } from "../../../constants"

interface ShapeToolsProps {
    setOpenOther: React.Dispatch<React.SetStateAction<boolean>>
}

const ShapeTools: React.FC<ShapeToolsProps> = ({ setOpenOther }) => {
    const [open, setOpen] = useState(false)

    const handleClickOpen = () => {
        setOpen(true)
    }

    const handleClose = () => {
        setOpen(false)
        setOpenOther(false)
    }

    const handleClick = (pageStyle: PageBackground) => () => {
        handlePageBackground(pageStyle)
        handleClose()
    }

    return (
        <>
            <IconButton onClick={handleClickOpen}>
                <BsGear id="icon" />
            </IconButton>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Select page background style</DialogTitle>
                <DialogContent>
                    <PageOptions>
                        <PagePreviewBlank
                            type="button"
                            onClick={handleClick(pageType.BLANK)}
                        />
                        <PagePreviewCheckered
                            type="button"
                            onClick={handleClick(pageType.CHECKERED)}
                        />
                        <PagePreviewRuled
                            type="button"
                            onClick={handleClick(pageType.RULED)}
                        />
                    </PageOptions>
                </DialogContent>
                <DialogOptions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogOptions>
            </Dialog>
        </>
    )
}

export default ShapeTools
