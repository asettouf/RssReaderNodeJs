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
  this.allPubDate = [];
  this.allPodsDesc = [];
  this.allPodsSummary = [];
  this.allPodsLinks =[];

  this.init=function(){
    this.getRSSFeed("http://localhost:3000/rss-retrieve/reliablesourcesaudio");
    var that = this;
    $(document.body).on("rssdone", function(ev, data){
      var there = that;
      that.podTitle = $("channel > description").html();
      that.maxPodcasts = $("item").length;
      $(document.body).html(data);
      $("item").each(function(index){
        there.allPubDate.push($(this).children("pubdate").html());
        there.allPodsDesc.push($(this).children("itunes\\:summary").html());
        there.allPodsSummary.push($(this).children("description").html());
        there.allPodsLinks.push($(this).children("enclosure").attr("url"));
      });
    });
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
