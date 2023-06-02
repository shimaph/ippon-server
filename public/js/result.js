//読み込み系
const nopponSound = new Audio('sounds/noppon.mp3');
const ipponSound = new Audio('sounds/ippon.mp3');
const sounds = Array.from({ length: 10 }, (_, i) => new Audio(`sounds/${i+1}.mp3`));
const images = Array.from({ length: 10 }, (_, i) => {
    let img = new Image();
    img.src = 'img/image_' + (i) + '.png';
    return img;
  });


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
let websocket;
const host = location.origin.replace(/^http/, 'ws');
const circles = document.querySelectorAll('.circle');
let point_counter = 0;

function connect() {
    websocket = new WebSocket(host);

    websocket.onopen = () => {
        console.log('WebSocket is connected.');
    };

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
        sounds[point_counter].play();

        //IPPON処理
        if(point_counter === 9) { 
            function sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms));
            }
              
            sleep(2000);
            ipponSound.play();

            //IPPON表示
            let divElement = document.createElement('div');
            divElement.className = 'ippon-content';
            divElement.innerText = 'IPPON';
            divElement.style.backgroundColor = '#fff';
            divElement.style.transition = 'background-color 1s';
            document.querySelector('.point').innerHTML = '';
            document.querySelector('.point').appendChild(divElement);

            setTimeout(() => {
            divElement.style.backgroundColor = 'rgb(250, 221, 1)';
            }, 100);


            //IPPONアニメーション
            // circles配列を逆順にする
            let reversedCircles = Array.from(circles).reverse();
        
            reversedCircles.forEach((circle, index) => {
                circle.style.transition = 'border 0.5s ease-in-out';
                setTimeout(() => {
                    circle.style.border = '25px solid #fff';       
                }, index * 50);  

                setTimeout(() => {
                    circle.style.borderWidth = '25px';
                    circle.style.borderStyle = 'solid';
                    circle.style.borderTopColor = 'rgb(250, 221, 1)';
                    circle.style.borderRightColor = 'rgb(192, 169, 1)';
                    circle.style.borderLeftColor = 'rgb(239, 209, 1)';
                    circle.style.borderBottomColor = 'rgb(192, 169, 1)';;
                }, (index + 1) * 100);

                circle.style.transition = "none";
            });

            

        
            //ippon時は確定の処理が要らないので、切り替え
            document.getElementById('confirm-button').innerHTML = 'リセット';
        }
        

        point_counter ++;
        websocket.send(point_counter);
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


//確定/リセットボタンに関する処理
document.getElementById('confirm-button').addEventListener('click', function() {
    if (this.innerHTML === '確定') {
        
        // 画像表示
        document.querySelector('.point').innerHTML = '';
        document.querySelector('.point').appendChild(images[point_counter]);

        // noppon再生
        nopponSound.play();
        
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

        // Reset image
        document.querySelector('.point').innerHTML = '';

        this.innerHTML = '確定';
    }
});