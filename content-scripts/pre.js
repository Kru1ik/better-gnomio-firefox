function fixLocalStorage() {
  chrome.storage.local.get(function(element) {
    if(element['data'] === undefined) {
      chrome.storage.local.set({'data':{}});
    }
  
    if(element === undefined || element['options'] === undefined) {
      chrome.storage.local.set({'options':{
        'wyswietlajnastronie':'0',
        'zaznaczajodpowiedzi':'0'
      }});
    }
  })
}

function fixText(text) {
  text = text.replace(/\r?\n|\r/g, "");
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}

fixLocalStorage();

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if(sender.id == 'better-gnomio@kru1ik') {

      if(request['highlight'] == 'searchbar' ) {
        $('#bg-search').css('background-color', 'red');
        setTimeout(function () {
          $('#bg-search').css('background-color', '');
        }, 1000)
      }

      if(request['window'] == 'refresh') {
        location.reload();
      }
    }
    // console.log(sender.tab.id ?
    //             "from a content script:" + sender.tab.url :
    //             "from the extension");
    // if (request.greeting === "hello")
    //   sendResponse({farewell: "goodbye"});
  }
);