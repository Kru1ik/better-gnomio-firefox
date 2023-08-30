
// url = https://data.mongodb-api.com/app/data-ulyfa/endpoint/data/v1/action/insertOne
// headers = {
//     'Content-Type': 'application/json',
//     'Access-Control-Request-Headers': '*',
//     'api-key': '<KEY>' //! provide key
// }
// body = {
//     "collection":"answers",
//     "database":"better-gnomio",
//     "dataSource":"Main",
//     "document": {
//         "name": "John Sample",
//         "age": 42
//     }
// }

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // if(request.type == "insert") {
    //     console.log(JSON.stringify(request.data))
    //     fetch("https://data.mongodb-api.com/app/data-ulyfa/endpoint/data/v1/action/insertOne", {
    //         method: 'POST',
    //         headers: headers = {
    //             'Content-Type': 'application/json',
    //             'Access-Control-Request-Headers': '*',
    //             'api-key': '<KEY>' //! provide key
    //         },
    //         body: JSON.stringify({
    //             "collection":"answers",
    //             "database":"better-gnomio",
    //             "dataSource":"Main",
                
    //             "document": request.data
    //         })
    //     })
    //         .then(response => response.json())
    //         .then(response => sendResponse({data: response}))
    //     return true
    // }



    if(request.type == "update") {
        chrome.storage.local.get(async function(element) {
            var data = {}
            console.log(element['data'])
            for(const [key, value] of Object.entries(element['data'])) {
                var newKey = key.replaceAll('.', '<#dot>')
                newKey = newKey.replaceAll('$', '<#dolar>')
                data[newKey] = value
            }
            console.log(data)
            fetch("https://data.mongodb-api.com/app/data-ulyfa/endpoint/data/v1/action/updateOne", {
                method: 'POST',
                headers: headers = {
                    'Content-Type': 'application/json',
                    'Access-Control-Request-Headers': '*',
                    'api-key': '<KEY>' //! provide key
                },
                body: JSON.stringify({
                    "collection":"answers",
                    "database":"better-gnomio",
                    "dataSource":"Main",
                    "filter": { "_id": 0 },
                    "update": {"$set": data},
                })
            })
                .then(response => {sendResponse({data: true})})
            return true
        })
    }




    if(request.type == "find") {
        fetch("https://data.mongodb-api.com/app/data-ulyfa/endpoint/data/v1/action/findOne", {
            method: 'POST',
            headers: headers = {
                'Content-Type': 'application/json',
                'Access-Control-Request-Headers': '*',
                'api-key': '<KEY>' //! provide key
            },
            body: JSON.stringify({
                "collection":"answers",
                "database":"better-gnomio",
                "dataSource":"Main",
                "filter": { "_id": 0 },
            })
        })
            .then(response => response.text())
            .then(response => {
                var mongoData = {}
                for(const [key, value] of Object.entries(JSON.parse(response)['document'])) {
                    var newKey = key.replaceAll('<#dot>', '.')
                    newKey = newKey.replaceAll('<#dolar>','$')
                    mongoData[newKey] = value
                }
                delete mongoData["_id"]

                chrome.storage.local.get(async function(element) {
                    var data = element["data"]
                    data = Object.assign(data, mongoData)
                        
                    await chrome.storage.local.set({'data':data})
                    sendResponse({data: true})

                    //TODO odświerzanie strony (chyba działa)
                    chrome.tabs.query({}, function(tabs) {
                        for(var tab of tabs) {
                            if(tab.url.includes('zs2ti.gnomio.com')) {
                                chrome.runtime.sendMessage(tab.id, {run: "refresh"});
                            }
                        }
                        
                    });
                })
            })
        return true
    }
})