$(document).ready(function(){
  var main = new MainHandler();
  main.init();
});

//TODO
//Enclosure tag attr url contains url of the video/audio
//Pull title of the podcasting: title tag
//Pull publication date of the podcast: pubdate tag
//Pull desc of podcast:description tag  and curr vid: itunes:summary
function MainHandler(){
  this.currentPodcast = 0;
  this.maxCurrentPodcast = 4;
  this.maxPodcasts = 0;
  this.podTitle = "";
  this.podDesc = "";
  this.allPubDate = [];
  this.allPodsDesc = [];
  this.allPodsSummary = [];
  this.allPodsLinks =[];

  this.init=function(){
    this.getRSSFeed("http://localhost:3000/rss-retrieve/reliablesourcesaudio");
    var that = this;
    $(document.body).on("rssdone", function(ev, data){
      ev.stopPropagation();
      $("#content").html(data);
      that.fillHeadlines();
      that.maxPodcasts = $("item").length;
      that.createPodcasts();
    });
  };

  this.loadVideo = function(){

  }
  this.createPodcasts = function(){
    $("item").each(function(index){
      var id = 'pod' + index;
      $("#podcastContainer").append("<div id=" + id + " class=pod data-src=" +
        $(this).children("enclosure").attr("url") + "> Clip n° " + index + " " +
        $(this).children("pubdate").html() + "<div class=podDesc>"
        + $(this).children("description").html() + "</div> <div class=podSummary>"
      + $(this).children("itunes\\:summary").html() + "</div></div>");
    });
    $(".pod").each(function(index){
      if (index > 3){
        $(this).toggle();
      }
    });
  };

  this.fillHeadlines = function(){
    this.maxPodcasts = $("item").length;
    $("#podtitle").html($("channel > title").html());
    $("#desc").html($("channel > description").html());
  };

  this.getRSSFeed = function(rssurl){
    var opts = {};
    opts["url"] = rssurl;
    opts["dataType"] = "html";
    console.log(opts);
    $.ajax(opts).done(function(data){
      $(document.body).trigger("rssdone", [data]);
    }).error(function(err){
      console.log("error");
      console.log(err);
    });
  };
}
