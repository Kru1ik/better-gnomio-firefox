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





document.getElementById('search').addEventListener('input', function () {
    var search = this.value.toLowerCase();
    if(search != '') {
        document.getElementById('hideonsearch').setAttribute('style', 'display: none;');
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
        document.getElementById('hideonsearch').removeAttribute('style');
        document.getElementById('results').innerHTML = '';
    }
});


document.getElementById('hgSearchBar').onclick = function () {sendMessage({highlight: 'searchbar'})}












const sendMessageId = document.getElementById("main");
sendMessageId.onclick = function() {
    
};