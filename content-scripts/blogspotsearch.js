async function blogspotSearch(x) {

    var response = await httpGet('https://html.duckduckgo.com/html/?q=site:blogspot.com egzamin ' + x.text());
    if (response == undefined || response == "") {
        return 'Błąd wczytywania DuckDuckGo (' + typeof response + ')';
    }

    var doc = new DOMParser().parseFromString(response, "text/html");
    response = await httpGet('https://' + Array.from(doc.getElementsByClassName('result__url')).find((value) => value.textContent.includes('egzamin')).textContent.replace(/\s+/g, ''));
    if (response == undefined || response == "") {
        return 'Błąd wczytywania BlogSpot (' + typeof response + ')';
    }

    //* Wyświetl odpowiedź
    try {
        doc = new DOMParser().parseFromString(response, "text/html");
        var question = doc.getElementsByClassName('post-body')[0];

        var answerInt = 0;
        
        var bList = question.getElementsByTagName('b')
        var bContent = bList[bList.length - 1].textContent
        
        switch(bContent) {
            case 'A':
                answerInt = 0
                break
            case 'B':
                answerInt = 1
                break
            case 'C':
                answerInt = 2
                break 
            case 'D':
                answerInt = 3
                break
        }
        var ol = question.getElementsByTagName('ol');
        var answer = ol[ol.length - 1].getElementsByTagName('li')[answerInt].textContent;
        if(answer == "") {
            return 'Odpowiedź jest pusta :< Ctrl + kółko myszy aby wyświetlić stronę';
        }

        return answer

    } catch {
        return 'Błąd, nie znaleziono odpowiedzi na "' + link.toString() + '"';
    }
}