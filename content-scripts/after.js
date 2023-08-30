chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if(request['run'] == 'refresh' ) {
        main();
      }

      if(request['window'] == 'refresh') {
        location.reload();
      }
      // console.log(sender.tab.id ?
      //             "from a content script:" + sender.tab.url :
      //             "from the extension");
      // if (request.greeting === "hello")
      //   sendResponse({farewell: "goodbye"});
    }
  );