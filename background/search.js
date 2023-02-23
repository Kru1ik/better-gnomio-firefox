chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {    
    if(request.contentScriptQuery == "getData") {
        var url = request.url;
        console.log(url.toString())
        fetch(url).then(response => response.text()).then(response => sendResponse(response))
        return true;
    }
    if(request.contentScriptQuery == "postData") {
        fetch(request.url).then(response => response.json()).then(response => sendResponse(response))
        return true;
    }
});