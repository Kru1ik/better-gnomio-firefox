$(function () {
    $('html').first().append(`
        <div style="position: fixed; left: 0; bottom: 0;">

            <style>
                #bg-search {
                    background-color: transparent;
                    border: none;
                }
                #bg-search:focus{
                    outline: none;
                    caret-color: transparent;
                }
                #bg-results {
                    width: 600px;
                    max-height: 300px;
                    /* background-color: rgba(255, 255, 255, 0.3); */
                    backdrop-filter: blur(3px);
                    display: flex;
                    flex-direction: column-reverse;
                    overflow: hidden;
                }
            </style>

            <div id="bg-results"></div>
            <input id="bg-search" type="text" autocomplete="off">
        </div>
    `);

    $('#bg-search').on('input', function () {
        var search = this.value;
        if(search != '') {
            chrome.storage.local.get(function(element) {
                var results = '';
                for(const [key, value] of Object.entries(element['data'])) {
                    if(key.toLowerCase().includes(search)) {
                        results = '<ul><li><b>' + key + '</b></li><li>' + value + '</li><br></ul>' + results;
                    } else
                    if(value.toLowerCase().includes(search)) {
                        results = '<ul><li><b>' + key + '</b></li><li>' + value + '</li><br></ul>' + results;
                    }
                }
                $('#bg-results').html(results);
            })
        } else {
            $('#bg-results').html('');
        }
    });

})