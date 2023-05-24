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
let point_counter = 0;

console.log("hey!!");

websocket.onmessage = (event) => {
    console.log('received: %s', event.data);


    const messageType = event.data.split(':')[0];

    if (messageType === 'Received' && point_counter >= 0 && point_counter < 10) {
        circles[point_counter].style.borderTop = 'solid rgb(250, 221, 1) 25px';
        circles[point_counter].style.borderRight = 'solid rgb(192, 169, 1) 25px';
        circles[point_counter].style.borderLeft = 'solid rgb(239, 209, 1) 25px';
        circles[point_counter].style.borderBottom = 'solid rgb(192, 169, 1) 25px';
        
        let sound = new Audio('sounds/'+ (point_counter + 1) +'.mp3');
        sound.play();

        //ippon音声再生処理
        console.log(point_counter);

        if(point_counter === 8) {
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
              }
              
              sleep(2000);
              const ipponSound = new Audio('sounds/ippon.mp3');
              ipponSound.play();

        }
        

        point_counter ++;
    }
        
};



//確定/リセットボタンに関する処理
document.getElementById('confirm-button').addEventListener('click', function() {
    if (this.innerHTML === '確定') {
        this.innerHTML = 'リセット';
    } else {
        point_counter = 0;
        let circleElements = document.getElementsByClassName('circle');
        for (let i = 0; i < circleElements.length; i++) {
            let circleElement = circleElements[i];
            circleElement.style.display = "none";
        }

        this.innerHTML = '確定';
    }
});
