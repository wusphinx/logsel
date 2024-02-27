document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save').addEventListener('click', function () {
        var endpoint = document.getElementById('logseq-endpoint').value;
        var token = document.getElementById('logseq-token').value;

        if (!endpoint || !token) {
            alert('endpoint and token are required!');
            e.preventDefault();
            return;
        }

        if (!healthCheckLogseq(endpoint, token)) {
            alert('please check endpoint and token');
            return;
        }

        chrome.storage.sync.set({ 'endpoint': endpoint, 'token': token }, function () {
            console.log('saved endpoint and token');
        });
    });
});


async function healthCheckLogseq(endpoint, token) {
    try {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            method: "logseq.Editor.getBlock"
        });

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            redirect: 'follow',
            body: raw,
        };

        const response = await fetch(endpoint, requestOptions);
        return response.status === 200;
    } catch (error) {
        console.log('fetch error', error);
        return false;
    }
}