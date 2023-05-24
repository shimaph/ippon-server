const host = location.origin.replace(/^http/, 'ws');
const websocket = new WebSocket(host);
const vote_Button = document.getElementById('vote_button');

vote_Button.addEventListener("click", function() {
    var lowerHalf = document.getElementById("lowerHalf");
    var upperHalf = document.getElementById("upperHalf");

    if (!lowerHalf.style.backgroundColor) {
        lowerHalf.style.backgroundColor = "yellow";
        websocket.send('VOTE');
    } else if (!upperHalf.style.backgroundColor) {
        upperHalf.style.backgroundColor = "yellow";
        websocket.send('VOTE');
    }
});



websocket.onmessage = (event) => {
    console.log('received: %s', event.data);

    //RESET処理
    if(event.data === "RESET"){
        lowerHalf.style.backgroundColor = null;
        upperHalf.style.backgroundColor = null;
    }
};
        