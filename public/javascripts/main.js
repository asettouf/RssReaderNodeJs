$(document).ready(function(){
  var main = new MainHandler();
  main.init();
});


function MainHandler(){
  //@param  {Number} currentPodcast [Podcast in use]
  this.currentPodcast = 0;
  //@param  {Number} maxCurrentPodcast [Current number of Podcasts in list]
  this.maxCurrentPodcast = 4;
  //@param  {Number} maxPodcasts [Current max number of Podcasts available]
  this.maxPodcasts = 0;
  //@param  {Boolean} isPlaying [Shows if a podcast is being played]
  this.isPlaying = false;

/**
 * Init function
 */
  this.init=function(){
    this.getRSSFeed("http://localhost:3000/rss-retrieve/reliablesourcesaudio");
    var that = this;
    $(document.body).on("rssdone", function(ev, data){
      ev.stopPropagation();
      $("#content").html(data);
      that.fillHeadlines();
      that.maxPodcasts = $("item").length;
      that.createPodcasts();
      that.loadVideo();
      var there = that;
      $(document.body).keyup(function(event){
        var shouldLoadVideo = there.enableArrowListeners(event);
        if(shouldLoadVideo){
          there.loadVideo();
        }
      });
    });
  };

/**
 * Load a video onto the stream tag
 */
  this.loadVideo = function(){
    var vidUrl = $("#pod" + this.currentPodcast).attr("data-src");
    $("#stream").attr("src", vidUrl);
    $("#description").html($("#pod" + this.currentPodcast +  " > .podSummary").html());
  };

  /**
   * Allows to read arrow up, down and enter keys
   * @param  {event} event [A key event]
   * @return {boolean}  shouldLoadVideo     [If key is arrow up or down, video should be loaded]
   */
  this.enableArrowListeners = function(event){
    var shouldLoadVideo = false;
    $("#pod" + this.currentPodcast).toggleClass("active");
    if(event.keyCode == 40 && this.currentPodcast < this.maxPodcasts - 1){
      this.switchNextItems();
      this.currentPodcast == 0 ? $("#arrowup").toggleClass("noshow") : "";
      this.currentPodcast++;
      this.currentPodcast == this.maxPodcasts -1 ? $("#arrowdown").toggleClass("noshow") : "";
      shouldLoadVideo = true;
    } else if(event.keyCode == 38 && this.currentPodcast > 0){
      this.switchPreviousItems();
      this.currentPodcast == this.maxPodcasts - 1 ? $("#arrowdown").toggleClass("noshow") : "";
      this.currentPodcast--;
      this.currentPodcast == 0 ? $("#arrowup").toggleClass("noshow") : "";
      shouldLoadVideo = true;
    } else if(event.keyCode == 13){
      var video = document.getElementById("stream");
      this.isPlaying ? video.pause(): video.play();
      this.isPlaying = !this.isPlaying;
    }
    $("#pod" + this.currentPodcast).toggleClass("active");
    return shouldLoadVideo;
  };


this.switchNextItems = function(){
  if(this.currentPodcast < this.maxPodcasts - this.maxCurrentPodcast){
    $("#pod" + this.currentPodcast).toggle();
    var nextId = this.currentPodcast + this.maxCurrentPodcast;
    $("#pod" + nextId).toggle();
  }
};

this.switchPreviousItems = function(){
  if(this.currentPodcast <=  this.maxPodcasts - this.maxCurrentPodcast ){
    var lastId = this.currentPodcast + this.maxCurrentPodcast - 1;
    $("#pod" + lastId).toggle();
    var prevId = this.currentPodcast - 1;
    $("#pod" + prevId).toggle();
  }

};
  /**
   * Create the podcast architecture
   */
  this.createPodcasts = function(){
    $("item").each(function(index){
      var id = 'pod' + index;
      var idVid = index + 1;
      $("#podcastContainer").append("<div id=" + id + " class='pod list-group-item' data-src=" +
        $(this).children("enclosure").attr("url") + "> Clip n° " + idVid + " " +
        $(this).children("pubdate").html() + "<div class=podDesc>"
        + $(this).children("description").html() + "</div> <div class=podSummary>"
      + $(this).children("itunes\\:summary").html() + "</div></div>");
    });
    $(".pod").each(function(index){
      if(index == 0){
        $(this).toggleClass("active");
      }
      else if (index > 3){
        $(this).toggle();
      }
    });
  };

  /**
   * fill the big title and summary
   */
  this.fillHeadlines = function(){
    this.maxPodcasts = $("item").length;
    $("#podtitle").html($("channel > title").html());
    $("#desc").html($("channel > description").html());
  };

/**
 * Read rss feed from given url onto localhost proxy
 * @param  {string} rssurl [url of the rss feed to target]
 */
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
