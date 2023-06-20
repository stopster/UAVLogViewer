// Disable all requests except GET
const open = XMLHttpRequest.prototype.open
XMLHttpRequest.prototype.open = function (method, url) {
    open.apply(this, arguments)
    const send = this.send
    this.send = function () {
        if (method === 'GET') {
            return send.apply(this, arguments)
        }
        console.log('blocked request to:', url)
    }
}

// Disable Web Socket connection
// eslint-disable
WebSocket = function () {
    console.log('WS is not allowed')
}
