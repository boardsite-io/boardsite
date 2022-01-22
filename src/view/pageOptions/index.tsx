import { FormattedMessage } from "language"
import React from "react"
import store from "redux/store"
import { CLOSE_PAGE_SETTINGS } from "redux/menu/menu"
import { Dialog, DialogContent, Button } from "components"
import { useCustomSelector } from "hooks"
import PageSettings from "components/pagesettings"
import { BsFileArrowUp } from "react-icons/bs"
import { handleChangePageBackground } from "drawing/handlers"

const onClose = () => {
    store.dispatch(CLOSE_PAGE_SETTINGS())
}
const onClickApplyToPage = () => {
    handleChangePageBackground()
    store.dispatch(CLOSE_PAGE_SETTINGS())
}

const PageOptions: React.FC = () => {
    const pageSettingsOpen = useCustomSelector(
        (state) => state.menu.pageSettingsOpen
    )

    return (
        <Dialog open={pageSettingsOpen} onClose={onClose}>
            <DialogContent>
                <PageSettings />
                <Button withIcon onClick={onClickApplyToPage}>
                    <BsFileArrowUp id="transitory-icon" />
                    <FormattedMessage id="PageSettings.SetPageBackground" />
                </Button>
            </DialogContent>
        </Dialog>
    )
}

export default PageOptions
