$(function() {
  chrome.storage.local.get(function(element) {

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



    

    //* question search
    $(".qtext").on('mouseup', function (e) {
      switch (e.which) {
        case 1:
          if(!e.ctrlKey) {
            navigator.clipboard.writeText($(this).not('script').text())
          }
          break;
        case 2:
          if(element['options']['uzywajduckduckgo'] == '0') {
            window.open('https://www.google.pl/search?q=' + $(this).not('script').text());
          } else {
            window.open('https://html.duckduckgo.com/html/?q=' + $(this).not('script').text());
          }
          break;
      }
    });


    //* answer search
    $(".answer").find(".ml-1").each(function() {
      $(this).on('mouseup', function (e) {
        switch (e.which) {
          case 2:
            if(element['options']['uzywajduckduckgo'] == '0') {
              window.open('https://www.google.pl/search?q=' + $(this).not('script').text());
            } else {
              window.open('https://html.duckduckgo.com/html/?q=' + $(this).not('script').text());
            }
            break;
        }
      });
    });



    //* image search
    $("img").each(function() {
      $(this).attr("title", $(this).attr("src"));
      $(this).bind('click', function() {
        window.open('https://www.google.com/searchbyimage?site=search&sa=X&image_url=' + $(this).attr("src"));
      });
    });
  })
});


  

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