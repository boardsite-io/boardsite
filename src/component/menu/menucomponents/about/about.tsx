import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from "@material-ui/core"
import React from "react"

interface AboutProps {
    isOpen: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const About: React.FC<AboutProps> = ({ isOpen, setOpen }) => (
    <Dialog
        maxWidth="xs"
        fullWidth
        open={isOpen}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle>About boardsite.io</DialogTitle>
        <DialogContent>
            <DialogContentText>
                boardsite.io is a free and open source productivity app for web,
                desktop and mobile
                <br />
                <br />
                {"Contribute to boardsite.io on "}
                <a href="https://github.com/boardsite-io">Github</a>
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpen(false)} color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>
)

export default About
