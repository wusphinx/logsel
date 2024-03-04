function saveOptions(e) {
    e.preventDefault();
    const endpoint = document.getElementById('logseq-endpoint').value;
    const token = document.getElementById('logseq-token').value;
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    fetch(endpoint, {
        method: 'POST',
        headers: myHeaders,
        redirect: 'follow',
        body: JSON.stringify({
            method: "logseq.Editor.getBlock"
        })
    })
        .then(response => {
            if (response.ok) {
                chrome.storage.sync.set({
                    endpoint: endpoint,
                    token: token
                }, function () {
                    setStatus('Congrats', true);
                    throwConfetti();
                });
            } else {
                setStatus('please check endpoint and token', false);
            }
        })
        .catch(error => {
            console.log('error', error);
            setStatus('please check endpoint and token', false);
        });
}

function setStatus(message, isSuccess) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.style.color = isSuccess ? 'green' : 'red';
    if (isSuccess) {
        setTimeout(function () {
            status.textContent = '';
        }, 750);
    }
}

function restoreOptions() {
    chrome.storage.sync.get(["endpoint"]).then((data) => {
        if (data.endpoint) {
            console.log("endpoint is " + data.endpoint);
            document.getElementById('logseq-endpoint').value = data.endpoint || '';
        }
    });

    chrome.storage.sync.get(["token"]).then((data) => {
        if (data.token) {
            console.log("token is " + data.token);
            document.getElementById('logseq-token').value = data.token || '';
        }
    });

    chrome.storage.sync.get({
        endpoint: '',
        token: ''
    }, function (items) {
        document.getElementById('logseq-endpoint').value = items.endpoint;
        document.getElementById('logseq-token').value = items.token;
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('options-form').addEventListener('submit', saveOptions);



// 撒花效果的函数实现
function throwConfetti() {
    const confettiCount = 100;
    const confettiWrapper = document.getElementById('confetti-wrapper');
    confettiWrapper.innerHTML = ''; // 确保清除之前的撒花

    for (let i = 0; i < confettiCount; i++) {
        let confetti = document.createElement('div');
        confetti.className = 'confetti';

        // 随机颜色和动画的延时
        confetti.style.backgroundColor = getRandomColor();
        confetti.style.left = `${Math.random() * 100}%`;
        confetti.style.animation = `confetti-fall ${Math.random() * 3 + 2}s linear infinite`;

        confettiWrapper.appendChild(confetti);
    }

    // 在动画完成后清除撒花元素
    setTimeout(() => confettiWrapper.innerHTML = '', 5000);
}

function getRandomColor() {
    const colors = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93'];
    return colors[Math.floor(Math.random() * colors.length)];
}