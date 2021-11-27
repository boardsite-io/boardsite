import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogOptions,
} from "components"
import React from "react"
import { useCustomSelector } from "hooks"
import { CLOSE_ABOUT } from "redux/menu/menu"
import store from "redux/store"

const About: React.FC = () => {
    const aboutOpen = useCustomSelector((state) => state.menu.aboutOpen)
    return (
        <Dialog open={aboutOpen} onClose={() => store.dispatch(CLOSE_ABOUT())}>
            <DialogTitle>About boardsite.io</DialogTitle>
            <DialogContent>
                <span>
                    <strong>Boardsite.io</strong> is a free and open source
                    productivity app for web, desktop and mobile. Contribute to
                    boardsite.io on{" "}
                    <a href="https://github.com/boardsite-io">Github</a>
                </span>
            </DialogContent>
            <DialogOptions>
                <Button onClick={() => store.dispatch(CLOSE_ABOUT())}>
                    Close
                </Button>
            </DialogOptions>
        </Dialog>
    )
}

export default About
