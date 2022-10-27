//* fixLocalStorage
chrome.storage.local.get(function(element) {
  if(element['options'] === undefined) {

    chrome.storage.local.set({'data':{}});

    chrome.storage.local.set({'options':{
      'wyswietlajnastronie':'0',
      'zaznaczajodpowiedzi':'0'
    }});
  }
})