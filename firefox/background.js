// background.js
function saveSelectedText(info, tab) {
    const selectedText = info.selectionText;
    const pageUrl = info.pageUrl;
    // 从存储中获取配置数据
    browser.storage.local.get(["endpoint", "token"], function (data) {
        if (data.endpoint && data.token) {
            // 保存到Logseq，可能需要添加API请求的代码
            saveToLogseq(data.endpoint, data.token, selectedText, pageUrl);
        }
    });
}

// 添加上下文菜单项
browser.contextMenus.create({
    id: "logseq-save-text",
    title: "保存到 Logseq",
    contexts: ["selection"],
    onclick: saveSelectedText
});

// 这里实现一个函数，用于跟Logseq的API接口通讯
function saveToLogseq(endpoint, token, text, url) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);
    myHeaders.append("Content-Type", "application/json");

    let data = JSON.stringify({
        "method": "logseq.Editor.insertBlock",
        "args": [
            "Logseq Clip Page",
            "TODO" + " [" + text.slice(0, 45) + "]" + "(" + url + ")",
            {
                "isPageBlock": true
            }
        ]
    });

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