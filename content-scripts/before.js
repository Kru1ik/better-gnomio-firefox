async function httpGet(url) {
  var uri = new URL(url);
  var respond = await new Promise((resolve) => {
    chrome.runtime.sendMessage({
      contentScriptQuery: "getData",
      url: uri.toString()
    }, function(response) {
      if(response != undefined && response != '') {
        resolve(response)
      }
    });
  }) 
  return respond.data; 
}

//* usuwa wszelkie nieprawidłowości z tekstu
function fixText(text) {
  text = text.replace(/\r?\n|\r/g, "");
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}








var storageLocal = {}

chrome.storage.local.get(function(element) {
  obj = element['data'];
  
})