function sendMessage(object) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(
            tabs[0].id,
            object, //dane przesłane do skryptu
            // function(response) {    //zamyka okno po kliknięciu
            //     window.close();
            // }
        );
    });
}

document.getElementById('copy').onclick = function () {
    chrome.storage.local.get(function (value) {
        navigator.clipboard.writeText(JSON.stringify(value['data']));
    });
}
document.getElementById('clear').onclick = function () {
    chrome.storage.local.set({'data':{}});
    displayDatabase();
}


document.getElementById('importbutton').onclick = function () {
    var json = JSON.parse(document.getElementById('importtext').value);
    if(typeof json === 'object') {
        chrome.storage.local.get(function (value) {
            var obj = Object.assign(value['data'], json)
            chrome.storage.local.set({'data':obj});
            sendMessage({window: 'refresh'})
            displayDatabase();
        });
    }
}


function displayDatabase() {
    var length = document.getElementById('length');

    // var items = chrome.storage.local.length;
    var data = document.getElementById('data');
    length.innerHTML = '';
    data.innerHTML = '';
    chrome.storage.local.get(function (value) {
        length.appendChild(document.createTextNode(Object.keys(value['data']).length))
        data.appendChild(document.createTextNode(JSON.stringify(value['data'])));
    });

}


// on load
displayDatabase();