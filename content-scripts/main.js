$(function() {
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
    text = text.replace(/\r?\n|\r/g, "");
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
  $(".qtext").bind("click", function () {
    window.open('https://www.google.pl/search?q=' + $(this).not('script').text());
  });

  //* image search
  $("img").each(function() {
    $(this).attr("title", $(this).attr("src"));
    $(this).bind('click', function() {
      window.open('https://www.google.com/searchbyimage?site=search&sa=X&image_url=' + $(this).attr("src"));
    });
  });

  // $(".flex-fill").bind("click", function () {
  //   navigator.clipboard.writeText($(this).text())
  // });
});
  