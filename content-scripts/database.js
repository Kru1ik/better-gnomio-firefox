$(function() {
    //* Baza danych
    var obj = {};
    chrome.storage.local.get(function(element) {
        obj = element['data'];
        $('.content').each(function() {

            //* Wyszukiwanie elementów
            var x = $(this).find('.qtext').first();
            var y = $(this).find('.rightanswer').first();

            //* Dodawanie do bazy danych
            if(y.text() != '') {
                //* Czy zawiera obraz
                var img = x.find('img');
                if(img.length) {
                    var nameList = img.first().attr('src').split('/');
                    var name = nameList.splice(-2, 2).join('/').toString();
                    obj[name] = y.text();
                } else {
                    obj[x.text()] = y.text();
                }

                chrome.storage.local.set({'data':obj});
            }

            //* Ustawianie odpowiedzi
            var answer = 'Brak danych :(';
            
            //* Czy zawiera obraz
            var img = x.find('img');
            if(img.length) {
                var name = img.first().attr('src').split('/'); //! Ostrzeżenie: Due to both security and performance concerns, this may not be set using dynamic values which have not been adequately sanitized. This can lead to security issues or fairly serious performance degradation.
                var name = name.splice(-2, 2).join('/').toString();
                if(obj[name] !== undefined) {
                    answer = obj[name];
                }
            } else {
                if(obj[x.text()] !== undefined) {
                    answer = obj[x.text()];
                }
            }

            //* hover title
            x.attr('title',answer);


            //? Opcjonalna odpowiedz za pytaniem
            if(element['options']['wyswietlajnastronie'] == '1') {x.after('<div style="font-weight: bold;">' + answer + '</div>');}

            //? Opcjonalne auto zaznaczenie
            if(element['options']['zaznaczajodpowiedzi'] == '1') {
                if(answer != 'Brak danych :(') {
                    var subAnswer = answer.substring(answer.indexOf(':') + 2)
                    $(this).find('.answer').first().children().each(function(i, k) {

                        //* input text
                        if($(k).is("input") && $(k).attr('type') == 'text') {
                            $(k).val(subAnswer).change()
                        } 
                        //* inne 
                        else {
                            var input = $(k).find('input[type!="hidden"]').first();
                            var selectBool = $(k).find('select').length > 0;
    
                            // fix text before equal check
                            var text = fixText($(k).text());

                            //* Igi kod
                            // usuwa jeśli na początku odpowiedzi jest "a) <odpowiedź>" lub "a. <odpowiedź>"
                            text = text.replace(/^[a-zA-Z0-9][).][\s]*/, "")
    
                            //* input
                            if(input.length) {
                                // radio
                                if(input.attr('type') == 'radio') {
                                    if(text == subAnswer) {
                                        input.click()
                                    } 
                                }
    
                                // checkbox
                                if(input.attr('type') == 'checkbox') {
                                    var answerList = subAnswer.split(', ');
                                    for(var element of answerList) {
                                        if(text == element) {
                                            input.click()
                                        } 
                                    }
                                }
                            } else
    
                            //* select
                            if(selectBool) {
                                var answerList = subAnswer.split(', ');
                                $(k).children().each(function(ki, kk) {
                                    var selText = fixText($(kk).find('.text').first().text()); //biało-pomarańczowy
                                    var answerFind = answerList.find(element => element.startsWith(selText));
    
                                    var select = $(kk).find('select').first() // select (w którym jest lista opcji)
                                    select.children().each(function(fki, fkk) {
                                        if(answerFind.endsWith(fixText($(fkk).text()))) {
                                            select.val($(fkk).val()).change();
                                        }
                                    })
                                })
                            }
                        }
                    })
                }
            }

            //? Wyszukaj odpowiedzi
            $(x).on('mouseup', function (e) {
                if (e.which == 1 && e.ctrlKey) {
                    x.attr('title', answer + '\n\nWyszukiwanie');


                    try {
                        var duckLink = new URL('https://html.duckduckgo.com/html/?q=site:blogspot.com egzamin ' + x.text());

                        chrome.runtime.sendMessage({contentScriptQuery: "getData", url: duckLink.toString()}, 
                            function (response) {
                                if (response != undefined && response != "") {
                                    var doc = new DOMParser().parseFromString(response, "text/html");
                                    var link =  new URL('https://' + doc.getElementsByClassName('result__url')[0].textContent.replace(/\r?\n|\r/g, "").replace(/\s+/g, ''));

                                    chrome.runtime.sendMessage({contentScriptQuery: "getData", url: link.toString()}, 
                                        function (response2) {
                                            if (response2 != undefined && response2 != "") {
                                                try {
                                                    var doc2 = new DOMParser().parseFromString(response2, "text/html");
                                                    var question = doc2.getElementsByClassName('post-body')[0];

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
                                                    
                                                    var answer2 = question.getElementsByTagName('li')[answerInt].textContent;

                                                    x.attr('title', answer + '\n\n' + answer2);
                                                    if(element['options']['wyswietlajnastronie'] == '1') {x.after('<div style="font-weight: bold;">Znaleziono: ' + answer2 + '</div>');}
                                                } catch {
                                                    x.attr('title', answer + '\n\nBłąd, nie znaleziono odpowiedzi na "' + link.toString() + '"');
                                                }

                                            } else {
                                                x.attr('title', answer + '\n\nBłąd wczytywania BlogSpot (' + typeof response2 + ')');
                                            }
                                        }
                                    );

                                } else {
                                    x.attr('title', answer + '\n\nBłąd wczytywania DuckDuckGo (' + typeof response2 + ')');
                                }
                            }
                        );
                    } catch {}


                    // try {
                    //     alert('try')
                    //     var duckLink = new URL('https://html.duckduckgo.com/html/?q=site:egzamin-e13.blogspot.com ' + x.text());
                    //     alert('try2')
                    //     fetch(duckLink).then(r => r.text()).then(result => {
                    //         alert('parse')
                    //         var doc = new DOMParser().parseFromString(result, "text/html");
                    //         alert('afterpasrse')

                    //         // try {
                    //             // href psuje sie winc chuj w pupe i taki sposub
                    //             //! popraw tego replace
                    //             var link = 'https://' + doc.getElementsByClassName('result__url')[0].textContent.replace(/\r?\n|\r/g, "").replace(/\s+/g, '');
                    //             fetch(link).then(r => r.text()).then(result2 => { 
                    //                 alert('doc2')
                    //                 var doc2 = new DOMParser().parseFromString(result2, "text/html");
                    //                 var question = doc2.getElementsByClassName('post-body')[0];

                    //                 var answerInt = 0;
                                    
                    //                 var bList = question.getElementsByTagName('b')
                    //                 var bContent = bList[bList.length - 1].textContent
                                    
                    //                 switch(bContent) {
                    //                     case 'A':
                    //                         answerInt = 0
                    //                         break
                    //                     case 'B':
                    //                         answerInt = 1
                    //                         break
                    //                     case 'C':
                    //                         answerInt = 2
                    //                         break 
                    //                     case 'D':
                    //                         answerInt = 3
                    //                         break
                    //                 }
                                    
                    //                 var answer2 = question.getElementsByTagName('li')[answerInt].textContent;
                    //                 alert('end')

                    //                 x.attr('title', answer + '\n' + answer2);
                    //                 if(element['options']['wyswietlajnastronie'] == '1') {x.after('<div style="font-weight: bold;">Znaleziono: ' + answer2 + '</div>');}

                    //                 // x.after('<div style="border: solid 1px white; margin: 8px; padding: 8px;">' + question.innerHTML + '</div>')
                    //             })
                    //         // } catch (e) {alert(e + '\n\n' + x.text() + '\n\n' + link + '\n\n\n' + duckLink.toString() + '\n\n' + result + '\n\n')} 
                    //     })
                    // } catch {
                    //     x.attr('title', answer + '\nNie znaleziono :(');
                    // }
                }
            });
            
        });
    })
})