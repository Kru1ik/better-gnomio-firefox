chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {    
    if(request.contentScriptQuery == "getData") {
        var url = request.url;
        fetch(url)
            .then(response => response.text())
            .then(response => sendResponse({data: response}))
        return true;
    }
    if(request.contentScriptQuery == "postData") {
        fetch(request.url, {
            method: 'POST',
            headers: request.headers,
            body: request.body
        })
            .then(response => response.json())
            .then(response => sendResponse({data: response}))
        return true;
    }
});