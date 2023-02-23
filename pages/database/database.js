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
function readFileAsText(file){
    return new Promise(function(resolve,reject){
        let fr = new FileReader();

        fr.onload = function(){
            resolve(fr.result);
        };

        fr.onerror = function(){
            reject(fr);
        };

        fr.readAsText(file);
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

document.getElementById('downloadfile').onclick = function() {
    // filename
    var filename = 'database.json';
    if(document.getElementById('downloadfilename').value != '') { filename = document.getElementById('downloadfilename').value + '.json'}

    // download
    chrome.storage.local.get(function (value) {
        var blob = new Blob([JSON.stringify(value['data'])], {type: "text/plain;charset=utf-8"});
        var url = URL.createObjectURL(blob);
        chrome.downloads.download({url: url, filename: filename})
    })
}

document.getElementById("importfile").onchange = function() {
    const files = document.getElementById('importfile').files;
    chrome.storage.local.get(function (value) {
        var data = value['data'];

        for(var file of files) {
            const reader = new FileReader();

            reader.onload = function() {
                var json = JSON.parse(reader.result);
                if(typeof json === 'object') {
                    data = Object.assign(data, json)
                    
                    chrome.storage.local.set({'data':data});
                    displayDatabase();
                }
            }

            reader.readAsText(file);
        }
    });
}

//* import raw
document.getElementById('importbutton').onclick = function () {
    var json = JSON.parse(document.getElementById('dataraw').value);
    if(typeof json === 'object') {
        chrome.storage.local.get(function (value) {
            var obj = Object.assign(value['data'], json)
            chrome.storage.local.set({'data':obj});
            displayDatabase();
        });
    }
}
//* remove raw
document.getElementById('removebutton').onclick = function () {
    var json = JSON.parse(document.getElementById('dataraw').value);
    if(typeof json === 'object') {
        chrome.storage.local.get(function (value) {
            var obj = value['data'];
            for(var element of Object.keys(json)) {
                if(obj[element] !== undefined) {
                    delete obj[element];
                }
            }
            chrome.storage.local.set({'data':obj});
            displayDatabase();
        });
    }
}


function displayDatabase() {
    var length = document.getElementById('length');

    var data = document.getElementById('data');
    
    chrome.storage.local.get(function (value) {
        length.innerHTML = '';
        data.innerHTML = '';


        length.textContent = Object.keys(value['data']).length;

        

        dataEntries = Object.entries(value['data'])
        for(const [key, val] of Object.entries(value['data'])) {
            // strzałka
            var arrow = document.createElement('span')
            arrow.style.color = 'grey';
            arrow.textContent = ' -> ';

            //usuń
            var del = document.createElement('button')
            del.setAttribute('style', 'margin: 0px 0px 0px 4px; border: none; cursor: pointer;')
            var img = document.createElement('img');
            img.style.width = '16px'
            img.src = '../../assets/trash_bin.png';
            del.appendChild(img);

            // element
            var li = document.createElement('li');
            li.appendChild(document.createTextNode(key))
            li.appendChild(arrow);
            li.appendChild(document.createTextNode(val))
            li.appendChild(del)
            data.appendChild(li);

            // onclick usun
            del.onclick = function() {
                chrome.storage.local.get(function(value) {
                    delete value['data'][key]
                    chrome.storage.local.set(value)
                    displayDatabase()
                })
            }
        }
        // data.appendChild(document.createTextNode(JSON.stringify(value['data'])));
    });

}


// on load
displayDatabase();