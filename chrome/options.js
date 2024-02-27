document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save').addEventListener('click', function () {
        var server = document.getElementById('logseq-server').value;
        var token = document.getElementById('logseq-token').value;

        if (!server || !token) {
            alert('server and token are required!');
            e.preventDefault();
            return;
        }

        if (!healthCheckLogseq(server, token)) {
            alert('please check server and token');
            return;
        }

        chrome.storage.sync.set({ 'server': server, 'token': token }, function () {
            console.log('saved server and token');
        });
    });
});


async function healthCheckLogseq(server, token) {
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

        const urlPath = new URL("api", server);
        const response = await fetch(urlPath.toString(), requestOptions);
        return response.status === 200;
    } catch (error) {
        console.log('fetch error', error);
        return false;
    }
}