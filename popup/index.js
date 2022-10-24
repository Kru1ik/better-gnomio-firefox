// const sendMessageId = document.getElementById("main");
// if (sendMessageId) {
//     sendMessageId.onclick = function() {
//         chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
//             chrome.tabs.sendMessage(
//                 tabs[0].id,
//                 { //dane przesłane do skryptu //aktualnie nie używane
//                     przyklad: 'xd',
//                     przyklad2: 'xx'
//                 },
//                 function(response) {    //zamyka okno po kliknięciu
//                     window.close();
//                 }
//             );
//         });
//     };
// }


document.getElementById('search').addEventListener('input', function () {
    var search = this.value.toLowerCase();
    if(search != '') {
        document.getElementById('hideonsearch').setAttribute('style', 'display: none;');
        chrome.storage.local.get(function(element) {
            var results = '';
            for(const [key, value] of Object.entries(element['data'])) {
                if(key.toLowerCase().includes(search)) {
                    results += '<ul><li><b>' + key + '</b></li><li>' + value + '</li><br></ul>';
                } else
                if(value.toLowerCase().includes(search)) {
                    results += '<ul><li><b>' + key + '</b></li><li>' + value + '</li><br></ul>';
                }
            }
            document.getElementById('results').innerHTML = results;
        })
    } else {
        document.getElementById('hideonsearch').removeAttribute('style');
        document.getElementById('results').innerHTML = '';
    }
});