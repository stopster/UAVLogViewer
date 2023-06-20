const { app, BrowserWindow, session } = require('electron')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1920,
        height: 1080
    })

    win.loadFile('./dist/index.html')
}

app.whenReady().then(() => {
    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })

    app.whenReady().then(() => {
        session.defaultSession.webRequest.onBeforeRequest({ urls: ['file://*'] }, (details, callback) => {
            if (details.url.match(/index\.html\/(Assets|Widgets|Workers)/)){
                callback({ redirectURL: details.url.replace(/index\.html\/(Assets|Widgets|Workers)/, '$1') })
            } else {
                callback({})
            }
        })
        session.defaultSession.webRequest.onBeforeSendHeaders({ urls: ['https://api.cesium.com/*', 'file://*'] }, (details, callback) => {
            details.requestHeaders['Origin'] = 'http://localhost:8080'
            details.requestHeaders['Referer'] = 'http://localhost:8080'

            callback({ requestHeaders: details.requestHeaders })
        })
    })
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
