document.getElementById("importfile").onchange = function() {
    const files = document.getElementById('importfile').files;

    var complete = 0 

    chrome.storage.local.get(function (value) {
        var data = value['data'];

        for(var file of files) {
            const reader = new FileReader();

            reader.onload = function() {
                var json = JSON.parse(reader.result);
                if(typeof json === 'object') {
                    data = Object.assign(data, json)
                    
                    chrome.storage.local.set({'data':data});
                    complete++;
                    if(files.length == complete) {window.close()}
                }
            }

            reader.readAsText(file);
        }
    });
}
