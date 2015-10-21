$('document').ready(function () {
  var apiRoot = 'https://en.wikipedia.org/w/api.php'
  var randomListTemplateSource   = $("#random-list-template").html();
  var randomListTemplate = Handlebars.compile(randomListTemplateSource);
  var linktoListTemplateSource   = $("#linkto-list-template").html();
  var linktoListTemplate = Handlebars.compile(linktoListTemplateSource);
  Handlebars.registerHelper('wikiLink', function(title) {
    return "https://en.wikipedia.org/wiki/" + title;
  });

  var currentArticleId = "";
  var currentTitle = "";

  $.ajax({
    url: apiRoot,
    data: {
      action: "query",
      list: "random",
      rnnamespace: 0,
      rnlimit: 10,
      format: "json"
    },
    dataType: 'jsonp',
  }).then(function (response) {
    console.log(response)
    var randomArticles = {articles: response.query.random}
    var html = randomListTemplate(randomArticles)
    $('#container').html(html)
  });

  $('#container').on("click", ".article-link", function(){
    currentArticleId = event.target.dataset.id;
    currentTitle = event.target.dataset.title;
    $.ajax({
      url: apiRoot,
      data: {
        action: "query",
        prop: "links",
        format: "json",
        titles: currentTitle
      },
      dataType: 'jsonp',
    }).then(loadLinktoList);

    $.ajax({
      url: apiRoot,
      data: {
        action: "query",
        list: "search",
        format: "json",
        srsearch: currentTitle
      },
      dataType: 'jsonp'
    }).then(updateHeading);
  });

  var updateHeading = function (response) {
    console.log(response);
    $('#snippet').append(response.query.search[0].snippet + "...")
  }

  var loadLinktoList = function (response) {
    var links = {articles: response.query.pages[currentArticleId].links}
    console.log(response)
    var html = linktoListTemplate(links)
    $('#container').html(html)
    $('h2').html('<a href="https://en.wikipedia.org/wiki/' + currentTitle + '">' + currentTitle + '</a>')
    if (response.continue) {
      var moreLink = $('<a href="#" data-continue="' + response.continue.plcontinue + '">More</a>')
      $('#container').append(moreLink);
      moreLink.on('click', function () {
        $.ajax({
          url: apiRoot,
          data: {
            action: "query",
            prop: "links",
            format: "json",
            titles: currentTitle,
            plcontinue: event.target.dataset.continue
          },
          dataType: 'jsonp',
        }).then(loadLinktoList);
      });
    }
  };
});

// /w/api.php?action=query&prop=links&format=json&titles=SS%20Rex





