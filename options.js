document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('save').addEventListener('click', function () {
        var endpoint = document.getElementById('logseq-endpoint').value;
        var token = document.getElementById('logseq-token').value;
        chrome.storage.sync.set({ 'endpoint': endpoint, 'token': token }, function () {
            console.log('设置已保存');
        });
    });
});