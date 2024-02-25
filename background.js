const iname = "logsel";

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    "id": iname,
    "title": "logseq selector",
    "contexts": ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === iname) {
    let data = JSON.stringify({
      "method": "logseq.Editor.insertBlock",
      "args": [
        "Test page",
        "TODO" + " [" + info.selectionText + "]" + "(" + info.pageUrl + ")",
        {
          "isPageBlock": true
        }
      ]
    });

    chrome.storage.sync.get(['endpoint', 'token'], function (items) {
      sendDataToLogseq(items.endpoint, items.token, data);
    });
  }
});


function sendDataToLogseq(endpoint, token, data) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + token);
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: data,
    redirect: 'follow'
  };

  fetch(endpoint, requestOptions)
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.log('error', error));
}