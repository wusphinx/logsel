// options.js
function saveOptions(e) {
    e.preventDefault();
    browser.storage.local.set({
        endpoint: document.querySelector("#endpoint").value,
        token: document.querySelector("#token").value
    });
}

document.getElementById('options-form').addEventListener('submit', saveOptions);