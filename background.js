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

    chrome.storage.sync.get(['server', 'token'], function (items) {
      console.log('logseq config:');
      console.log('server:', items.server);
      console.log('token:', items.token);

      sendDataToLogseq(items.server, items.token, data);
    });
  }
});


function sendDataToLogseq(server, token, data) {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);
  myHeaders.append("Content-Type", "application/json");

  const urlPath = new URL("api", server);
  endpoint = urlPath.toString();

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