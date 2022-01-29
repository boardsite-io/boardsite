import { FormattedMessage } from "language"
import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogOptions,
} from "components"
import React, { memo } from "react"
import { useCustomSelector } from "hooks"
import { CLOSE_ABOUT } from "redux/menu"
import store from "redux/store"

const strong = (chunks: string) => <strong>{chunks}</strong>
const github = (chunks: string) => (
    <a href="https://github.com/boardsite-io">{chunks}</a>
)

const About: React.FC = memo(() => {
    const aboutOpen = useCustomSelector((state) => state.menu.aboutOpen)
    return (
        <Dialog open={aboutOpen} onClose={() => store.dispatch(CLOSE_ABOUT())}>
            <DialogTitle>
                <FormattedMessage id="About.Title" />
            </DialogTitle>
            <DialogContent>
                <span>
                    <FormattedMessage
                        id="About.Description"
                        values={{
                            strong,
                            github,
                        }}
                    />
                </span>
            </DialogContent>
            <DialogOptions>
                <Button onClick={() => store.dispatch(CLOSE_ABOUT())}>
                    <FormattedMessage id="About.Close" />
                </Button>
            </DialogOptions>
        </Dialog>
    )
})

export default About
