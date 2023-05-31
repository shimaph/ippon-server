let websocket;
const host = location.origin.replace(/^http/, 'ws');
const vote_Button = document.getElementById('vote_button');

function connect() {
    websocket = new WebSocket(host);

    websocket.onopen = () => {
        console.log('WebSocket is connected.');
    };

    websocket.onmessage = (event) => {
        console.log('received: %s', event.data);

        var lowerHalf = document.getElementById("lowerHalf");
        var middleHalf = document.getElementById("middleHalf");
        var upperHalf = document.getElementById("upperHalf");

        //RESET処理
        if(event.data === "RESET"){
            lowerHalf.style.backgroundColor = null;
            middleHalf.style.backgroundColor = null;
            upperHalf.style.backgroundColor = null;
        }
    };

    websocket.onclose = function(e) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
        setTimeout(function() {
            connect();
        }, 1000);
    };

    websocket.onerror = function(err) {
        console.error('Socket encountered error: ', err.message, 'Closing socket');
        websocket.close();
    };
}

connect();

vote_Button.addEventListener("click", function() {
    var lowerHalf = document.getElementById("lowerHalf");
    var middleHalf = document.getElementById("middleHalf");
    var upperHalf = document.getElementById("upperHalf");

    if (!lowerHalf.style.backgroundColor) {
        lowerHalf.style.backgroundColor = "yellow";
        websocket.send('VOTE');
    } else if (!middleHalf.style.backgroundColor) {
        middleHalf.style.backgroundColor = "yellow";
        websocket.send('VOTE');
    } else if (!upperHalf.style.backgroundColor) {
        upperHalf.style.backgroundColor = "yellow";
        websocket.send('VOTE');
    }
});
