
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
            displayDatabase();
        });
    }
}


function displayDatabase() {
    var length = document.getElementById('length');

    // var items = chrome.storage.local.length;
    var data = document.getElementById('data');
    data.innerHTML = '';
    chrome.storage.local.get(function (value) {
        length.innerText = '' + Object.keys(value['data']).length;
        data.innerHTML = '<h3>' + '</h3>' +'<div>' + JSON.stringify(value['data']) + '</div>';
    });

}


// on load
displayDatabase();