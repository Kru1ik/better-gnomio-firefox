

function displayOptions() {
    chrome.storage.local.get(function(element) {
        for(var [key, value] of Object.entries(element['options'])) {
            var wyswietl = document.getElementById(key);
            if(value == 0) {
                wyswietl.checked = false;
            } else {
                wyswietl.checked = true;
            }
        }
    })
}

async function changeButton(id) {
    var element = await new Promise(function(resolve) {
        chrome.storage.local.get(function(result) {
            resolve(result);
        });
    });
    var change = element['options']
    if(element['options'][id] == 0) {
        change[id] = 1
    } else {
        change[id] = 0
    }
    await chrome.storage.local.set({'options':change})
    displayOptions();
}

Array.from(document.getElementsByTagName('input')).forEach((checkbox) => {
    checkbox.addEventListener('change', function() {
        var id = checkbox.getAttribute('id')
        changeButton(id).then(() => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {run: "refresh"});
            });
        });
    });
});


displayOptions();