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

function fixText(text) {
  text = text.replace(/\r?\n|\r/g, "");
  text = text.replace(/\s+/g, ' ').trim();
  return text;
}