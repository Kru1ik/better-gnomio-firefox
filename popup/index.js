function createSearchElement(key, value) {
    var title = document.createElement('b');
    title.appendChild(document.createTextNode(key));

    var liTitle = document.createElement('li');
    liTitle.appendChild(title);

    var liAnswer = document.createElement('li');
    liAnswer.appendChild(document.createTextNode(value));

    var ul = document.createElement('ul');
    ul.appendChild(liTitle);
    ul.appendChild(liAnswer);
    ul.appendChild(document.createElement('br'));

    return ul;
}

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








//* przyciski
document.querySelectorAll('a[target=_blank]').forEach(function(value) {
    // musi być opóźnienie bo inaczej otwiera w nowym oknie przeglądarki
    value.onclick = function() {setTimeout(function() {window.close()}, 10)}
})


//* ilość danych
function displayDataCount() {
    chrome.storage.local.get(function(value) {
        document.getElementById('length').innerHTML = '';
        document.getElementById('length').appendChild(document.createTextNode(Object.keys(value['data']).length))
    })
}
displayDataCount();

//* search bar
document.getElementById('search').addEventListener('input', function () {
    var search = this.value.toLowerCase();
    if(search != '') {
        // document.getElementById('hideonsearch').setAttribute('style', 'display: none;');
        chrome.storage.local.get(function(element) {
            var results = document.getElementById('results');
            results.innerHTML = '';
            // var results = document.createElement('div');
            for(const [key, value] of Object.entries(element['data'])) {
                if(key.toLowerCase().includes(search)) {
                    results.appendChild(createSearchElement(key, value));
                    // results += '<ul><li><b>' + key + '</b></li><li>' + value + '</li><br></ul>';
                } else
                if(value.toLowerCase().includes(search)) {
                    

                    results.appendChild(createSearchElement(key, value));

                    // results += '<ul><li><b>' + key + '</b></li><li>' + value + '</li><br></ul>';
                }
            }
            // document.getElementById('results').innerHTML = results; //! Ostrzeżenie: Due to both security and performance concerns, this may not be set using dynamic values which have not been adequately sanitized. This can lead to security issues or fairly serious performance degradation.
        })
    } else {
        // document.getElementById('hideonsearch').removeAttribute('style');
        document.getElementById('results').innerHTML = '';
    }
});

// //* podświetl ukryty pasek wyszukiwania
// document.getElementById('hgSearchBar').onclick = function () {sendMessage({highlight: 'searchbar'})}





// * quickexport
// kopia download z database.js
document.getElementById('quickexport').onclick = function() {
    // filename
    var filename = 'database.json';

    // download
    chrome.storage.local.get(function (value) {
        var blob = new Blob([JSON.stringify(value['data'])], {type: "text/plain;charset=utf-8"});
        var url = URL.createObjectURL(blob);
        chrome.downloads.download({url: url, filename: filename})
    })
}

//* quickclear
document.getElementById('quickclear').onclick = function() {
    chrome.storage.local.set({'data':{}});
    displayDataCount();
}









document.getElementById('mongodownload').onclick = function() {  
    chrome.runtime.sendMessage({
        type: "find"
    }, function(response) {
        if(response != undefined && response != '') {
          displayDataCount()
        }
      });
}


document.getElementById('mongosend').onclick = function() {
    chrome.runtime.sendMessage({
        type: "update",
    })
}