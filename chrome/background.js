const iname = "logseqclip";

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    "id": iname,
    "title": "Logseq Clip",
    "contexts": ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === iname) {
    let data = JSON.stringify({
      "method": "logseq.Editor.insertBlock",
      "args": [
        "Logseq Clip Page",
        "TODO" + " [" + info.selectionText.slice(0, 45) + "]" + "(" + info.pageUrl + ")",
        {
          "isPageBlock": true
        }
      ]
    });

    chrome.storage.sync.get(['endpoint', 'token'], function (items) {
      console.log('logseq config:');
      console.log('endpoint:', items.endpoint);
      console.log('token:', items.token);

      sendDataToLogseq(items.endpoint, items.token, data);
    });
  }
});


function sendDataToLogseq(endpoint, token, data) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
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