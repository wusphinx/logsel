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
                    setStatus('ok', true);
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
    chrome.storage.sync.get({
        endpoint: '',
        token: ''
    }, function (items) {
        document.getElementById('endpoint').value = items.endpoint;
        document.getElementById('token').value = items.token;
    });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('options-form').addEventListener('submit', saveOptions);