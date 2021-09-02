import {
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogOptions,
} from "@components"
import React from "react"

interface AboutProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const About: React.FC<AboutProps> = ({ isOpen, setOpen }) => (
    <Dialog open={isOpen} onClose={() => setOpen(false)}>
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
            <Button onClick={() => setOpen(false)}>Close</Button>
        </DialogOptions>
    </Dialog>
)

export default About
