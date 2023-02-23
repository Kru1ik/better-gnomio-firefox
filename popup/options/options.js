

function displayOptions() {
    chrome.storage.local.get(function(element) {
        for(var [key, value] of Object.entries(element['options'])) {
            var wyswietl = document.getElementById(key);
            if(value == '0') {
                wyswietl.checked = false;
            } else {
                wyswietl.checked = true;
            }
        }
    })
}

function changeButton(id) {
    chrome.storage.local.get(function(element) {
        if(element['options'][id] == '0') {
            var change = element['options']
            change[id] = '1'
            chrome.storage.local.set({'options':change})
        } else {
            var change = element['options']
            change[id] = '0'
            chrome.storage.local.set({'options':change})
        }
        displayOptions();
    });
}




document.getElementById('wyswietlajnastronie').onclick = () => changeButton('wyswietlajnastronie');
document.getElementById('zaznaczajodpowiedzi').onclick = () => changeButton('zaznaczajodpowiedzi');
document.getElementById('uzywajduckduckgo').onclick = () => changeButton('uzywajduckduckgo');





displayOptions();