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
                var name = img.first().attr('src').split('/');
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
    
                            //* input
                            if(input.length) {
                                // radio
                                if(input.attr('type') == 'radio') {
                                    //! include
                                    if(text.includes(subAnswer)) {
                                        input.click()
                                    } 
                                }
    
                                // checkbox
                                if(input.attr('type') == 'checkbox') {
                                    var answerList = subAnswer.split(', ');
                                    for(var element of answerList) {
                                        //! nie może być include bo zaznacza za dużo
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

            // // //? Opcjonalne auto zaznaczenie
            // if(element['options']['zaznaczajodpowiedzi'] == '1') {
            //     $(this).find('.answer').first().children().each(function(i, k) {
            //         // fix text before equal check
            //         var text = $(k).text();
            //         text = text.replace(/\r?\n|\r/g, "");
            //         text = text.replace(/\s+/g, ' ').trim()

            //         if(answer.includes(text)) {
            //             $(k).find('input').first().click()
            //         } 
            //         // else {
            //         //     alert('"'+answer+'"'+text+'"')
            //         // }
            //     })
            // }
        });
    })
})