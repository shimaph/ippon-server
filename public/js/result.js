//映像に関する実装
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            video.srcObject = stream;
        })
        .catch((err) => {
            console.error('An error occurred: ' + err);
        });
} else {
    console.error('getUserMedia not supported');
}




//投票反映実装(websocket)
const host = location.origin.replace(/^http/, 'ws');
const websocket = new WebSocket(host);
const circles = document.querySelectorAll('.circle');
let point_counter = 1;

console.log("hey!!");

websocket.onmessage = (event) => {
    console.log('received: %s', event.data);


    const messageType = event.data.split(':')[0];

    if (messageType === 'Received' && point_counter >= 1 && point_counter <= 10) {
        circles[point_counter].style.borderTop = 'solid rgb(250, 221, 1) 25px';
        circles[point_counter].style.borderRight = 'solid rgb(192, 169, 1) 25px';
        circles[point_counter].style.borderLeft = 'solid rgb(239, 209, 1) 25px';
        circles[point_counter].style.borderBottom = 'solid rgb(192, 169, 1) 25px';
        
        const music = new Audio('sounds/'+ point_counter +'.mp3');
        music.play();
        point_counter ++;
    }
        
};


