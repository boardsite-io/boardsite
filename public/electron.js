// eslint-disable-next-line import/no-extraneous-dependencies
const { app, BrowserWindow, Menu } = require("electron")
const path = require("path")
const isDev = require("electron-is-dev")

function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: { nodeIntegration: false },
    })
    win.webContents.openDevTools()

    win.loadURL(
        isDev
            ? "http://localhost:3000"
            : `file://${path.join(__dirname, "../build/index.html")}`
    )

    Menu.setApplicationMenu(null)
}

app.on("ready", createWindow)
