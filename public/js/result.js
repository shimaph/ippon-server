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



websocket.onmessage = (event) => {
    console.log(event.data);

    if (event.data === "VOTE" && point_counter >= 0 && point_counter < 10) {
        let circle = circles[point_counter];

        circle.style.borderWidth = '25px';
        circle.style.borderStyle = 'solid';
        circle.style.borderTopColor = 'rgb(250, 221, 1)';
        circle.style.borderRightColor = 'rgb(192, 169, 1)';
        circle.style.borderLeftColor = 'rgb(239, 209, 1)';
        circle.style.borderBottomColor = 'rgb(192, 169, 1)';

        //sound再生
        let sound = new Audio('sounds/'+ (point_counter + 1) +'.mp3');
        sound.play();

        //ippon音声再生処理
        console.log(point_counter);

        if(point_counter === 9) {
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

    //リセット処理
    } else {
        websocket.send('RESET');
        point_counter = 0;
        let circleElements = document.getElementsByClassName('circle');
        for (let i = 0; i < circleElements.length; i++) {
            let circleElement = circleElements[i];
            circleElement.style.border = 'none';

        }

        this.innerHTML = '確定';
    }
});
