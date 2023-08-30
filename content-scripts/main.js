function main() {
  chrome.storage.local.get(function(element) {

    
    $("#bg-answer-style").remove();
    if(element["options"]["wyswietlajnastronie"] != 1) {
      $("head").first().append(`
        <style id="bg-answer-style">
          .bg-answer {
            height: 0px;
            overflow: hidden;
          }
        </style>
      
      `);
    }

    //* add custom div under question
    $('.bg-answer').remove();
    $('.qtext').after('<div class="bg-answer"></div>')



    //* close AdBlock dialog
    $('.tingle-modal__close').click();

    //* remove this weird shit <script> from .qtext
    // $('html').text('a');
    $(".qtext").find('script').remove();
    
    //* fixing document formating
    $(".qtext, .rightanswer").each(function() {
      
      var text = $(this).text();
      var img = $(this).find('img');
      
      // remove new line \n etc.
      text = text.replace(/\r?\n|\r/g, ' ');
      // remove whitespaces
      text = text.replace(/\s+/g, ' ').trim()
      
      $(this).text(text);

      // image fix
      if(img.length) {
        $(this).append('<br>');
        $(this).append(img);
      }
    });

    //* prevent opening in popup window
    $("input, button").each(function() {
      $(this).on('mouseup', function (e) {
        if(e.which == 2) {
          var clone = $(this).clone(true).off()
          clone.attr('hidden', true)
          $(this).after(clone)
          clone.click()
        }
      });
    });



    
    $(".qtext").off();
    $(".qtext").on('mouseup', function (e) {
      if(!e.ctrlKey) {
        switch (e.which) {
          //* copy to clipboard
          case 1:
            if(!e.ctrlKey) {
              navigator.clipboard.writeText($(this).not('script').text())
            }
            break;

          //* question search
          case 2:
            if(element['options']['uzywajduckduckgo'] != 1) {
              window.open('https://www.google.pl/search?q=' + $(this).not('script').text());
            } else {
              window.open('https://html.duckduckgo.com/html/?q=' + $(this).not('script').text());
            }
            break;
        }
      }
    });


    //* answer search
    $(".ml-1").off();
    $(".ml-1").on('mouseup', function (e) {
      if(!e.ctrlKey) {
        switch (e.which) {
          case 2:
            if(element['options']['uzywajduckduckgo'] != 1) {
              window.open('https://www.google.pl/search?q=' + $(this).not('script').text());
            } else {
              window.open('https://html.duckduckgo.com/html/?q=' + $(this).not('script').text());
            }
            break;
        }
      };
    });



    // //* image search
    // $("img").each(function() {
    //   $(this).attr("title", $(this).attr("src"));
    //   $(this).bind('click', function() {
    //     window.open('https://www.google.com/searchbyimage?site=search&sa=X&image_url=' + $(this).attr("src"));
    //   });
    // });

    //* content scripts
    $('.content').each(function(con, content) {
      var x = $(content).find('.qtext').first();
      var y = $(content).find('.rightanswer').first();
      var z = $(content).find('.bg-answer').first();

      $(x).on('mouseup', function (e) {

        //* search on blogspot
        if ((e.which == 1 || e.which == 2) && (e.ctrlKey || element['options']['mobilnesterowanie'] == '1')) {
          var title = x.attr('title');

          x.attr('title', title + '\n\nWyszukiwanie');
          try {
            blogspotSearch(x).then((answer) => {
              x.attr('title', title + '\n\n' + answer);

              //* Opcjonalna odpowiedz za pytaniem
              if(element['options']['wyswietlajnastronie'] == '1' || element['options']['mobilnesterowanie'] == '1') {
                z.append('<div style="font-weight: bold;">Znaleziono: ' + answer + '</div>');
              }
            });
          } catch (e) {
            x.attr('title', title + '\n\n' + e.toString());
          }
        }

      });



      //* baza danych
      dataBase(content, element, x ,y, z);


    });
  })
}

main();


  

// $(selector).on('mouseup', function (e) {
//   switch (e.which) {
//   // Left Click.
//   case 1:
//       // By way of example, I've added Ctrl+Click Modifiers.
//       if (e.ctrlKey) {
//           // Ctrl+LeftClick behaviour.
//       } else {
//           // Standard LeftClick behaviour.
//       }
//       break;

//   // Middle click.
//   case 2:
//       // Interrupts "Firefox Open New Tab" behaviour.
//       break;

//   // Default behaviour for right click.
//   case 3:
//       return;
//   }
// });