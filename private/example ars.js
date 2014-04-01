(function(){
  var timer = null
    , status_timer = null
    , queue_timer = null
    , sub = false
    , interval = 3 * 1000
    , status_interval = 60 * 1000
    , queue = []
    , update = true
    , scroll_position = 0
    , liveblog = null
    , img_re = /^http[^\s]*\.(?:jpe?g|gif|png|bmp|svg)[^\/]*$/i
    , url_re = /(https?:\/\/[^\s<"]*)/ig;

  function initial_update(posts) {
    var posts = $(posts).sort(function(a,b){
      return (b['id'] - a['id']);
    });
    var html = $.map(posts, function(post, i) {
      return post['delete'] ? "" : post['html'];
    }).join("");
    liveblog.html(html);
    queue = posts.toArray();
    timer = setTimeout(fetch_recent, interval);
  }

  function update_recent(posts) {
    $(posts).sort(function(a,b){
      return (a['id'] - b['id']);
    }).each(function(i, post) {
      var elem = $('#post-' + post['id']);

      if (post['delete']) {
        elem.remove();
        return;
      }

      if (!elem.length) {
        var item = $(post['html'])
          , animate = false;

        save_scroll();

        animate = !is_scrolled();
        item.addClass("new");
        if (animate) item.hide();

        liveblog.prepend(item);
        fix_scroll(item.outerHeight());

        if (animate) item.slideDown();

        queue.unshift(post);
      }
      else if (elem.attr('data-post-version') != post['version']) {
        elem.replaceWith(post['html']);
        queue.unshift(post);
      }

      var stuck = $('#sticky-' + post['id']);
      // it may have been inserted but stickied after the fact
      if (post['sticky'] && !stuck.length) {
        stick_post(post['id']);
      }
      // got unstickied
      else if (!post['sticky'] && stuck.length) {
        stuck.remove();
      }
    });

    setTimeout(function(){ $('.ars-liveblog-post.new').removeClass("new") }, 1000);
    timer = setTimeout(fetch_recent, interval);
  }

  function process_queue() {
   try {
      $(queue.splice(0,10)).each(function(i, post) {
        process_post(post);
      });
    } catch(e) {}

    queue_timer = setTimeout(process_queue, 100);
  }

  function process_post(post) {
    // need to process stuck version too
    var elems = $('#post-' + post['id'] + ',#sticky-' + post['id']);
    elems.each(function(i,node) {
      elem = $(node);
      if (elem.hasClass("processed")) return;

      linkify(node);
      imagify(node);
      clean_date(post['id']);

      elem.addClass("processed");
    });
  }

  function stick_post(post_id) {
    if ($('#sticky-'+post_id).length) return;

    var stickies = $('#stickies ul');
    var post = $('#post-'+post_id);

    if (post.length) {
      var content = post.find('.post-content').html();
      var li = $('<li>');
      li.attr('id', 'sticky-'+post_id);
      li.html(content);
      stickies.append(li);
    }
  }

  function fetch_status() {
    clearTimeout(status_timer);
    $.ajax({
      url: "status.json?"+(new Date()).getTime(),
      dataType: "json",
      success: function(data) {
        update = data['updating'];
        status_el = $('#status').get(0);

        if (update) {
          status_el.className = "updating";
          $('#not-started').remove();
        } else {
          status_el.className = "stopped";
        }

        status_timer = setTimeout(fetch_status, status_interval);
      },
      error: function(req) {
        status_timer = setTimeout(fetch_status, status_interval);
      }
    });
  }

  function fetch_recent() {
    clearTimeout(timer);

    if (!update) {
      timer = setTimeout(fetch_recent, interval);
      return;
    }

    $.ajax({
      url: "recent.json?"+(new Date()).getTime(),
      dataType: "json",
      success: update_recent,
      error: function(req) {
        timer = setTimeout(fetch_recent, interval);
      }
    });
  }

  function fetch_all() {
    $.ajax({
      url: "events.json?"+(new Date()).getTime(),
      dataType: "json",
      success: initial_update,
      error: function(req) {
        timer = setTimeout(fetch_all, interval);
      }
    });
  }

  function linkify(elem) {
    var children = elem.childNodes;
    var length = children.length;

    for (var i=0; i < length; i++) {
      var node = children[i];
      if (node.nodeName == "A") {
        continue;
      }
      else if (node.nodeName != "#text") {
        linkify(node);
      }
      else if (node.nodeValue.match(url_re)) {
        var span = document.createElement("SPAN");
        var escaped = $('<div/>').text(node.nodeValue).html();
        span.innerHTML = escaped.replace(
          url_re, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
        node.parentNode.replaceChild(span, node);
      }
    }
  }

  function imagify(elem) {
    $(elem).find('a').each(function(i, a) {
      a = $(a);
      var href = a.html();
      if (img_re.test(href)) {
        var img = $('<img/>');
        img.on('load', function() {
          var animate = !is_scrolled();
          if (animate) img.hide();
          save_scroll();
          a.html(img);
          var height = img.height();
          if (height > 480) {
            var width = img.width();
            img.width(Math.floor((480 / height) * width));
            img.height(480);
          }
          if (animate) img.slideDown();
          // bleh, min table cell height makes this harder
          fix_scroll(img.outerHeight() - 16);
        });
        img.attr('target', '_blank');
        img.attr('src', href);
      }
    });
  }

  function track_pageview(path) {
    path = path||null;
    try {
      if(path === null) {
        _gaq.push(['_trackPageview']);
      } else {
        _gaq.push(['_trackPageview', path]);
      }
    } catch(e) {}

    try {
      eval(s.t()); // omniture!!!
    } catch(e) {}

    return false;
  }

  function reload_ads() {
    try{
      cnp.ad.manager.reloadAds();
    } catch(err) {}
    return false;
  }

  function pageview(path) {
    path = path||null;
    reload_ads();
    track_pageview(path);
    return false;
  }

  function clean_date(post_id) {
    var li = $('#post-' + post_id);
    if (li.length) {
      var date_display = li.find('.post-date');
      var seconds = li.attr("data-time");
      var date = new Date(seconds * 1000);
      var hours = String(date.getHours());
      var min = String(date.getMinutes());
      if (hours.length < 2) hours = "0" + hours;
      if (min.length < 2) min = "0" + min;
      date_display.html(hours + ":" + min);
      date_display.attr('title', date.toString());
    }
  }

  function fix_scroll(pixels) {
    if (is_scrolled()) {
      window.scrollTo($(window).scrollLeft(), scroll_position + pixels);
    }
  }

  function is_scrolled() {
    return scroll_position > liveblog.offset().top;
  }

  function save_scroll() {
    scroll_position = $(window).scrollTop();
    return scroll_position;
  }

  var rewrite_url = false;

  if (window.location.toString().match("sub")) {
    sub = true;
    ars.sidebar_ad = function(){};
    ars.masthead_ad = function(){};
    $(document).ready(function(){
      $('#stickies').css({"border-top" : "none", "padding-top": 0});
      $('#side-ad, #masthead-ad').remove()
    });
    if (window.history.pushState) {
      window.history.pushState({}, document.title, window.location.pathname);
    }
  }

  if (window.location.toString().match("thanks")) {
    $(document).ready(function(){
      $('#comment-form').before("<p>Thanks for your comment, buddy!</p>");
    });
    if (window.history.pushState) {
      window.history.pushState({}, document.title, window.location.pathname);
    }
  }


  $(document).ready(function() {
    liveblog = $('#ars-liveblog-posts');
    fetch_all();
    fetch_status();
    if (sub) {
      var redir = $('#comment-form').find('input[name="redirect_to"]');
      redir.val( redir.val().replace("?thanks", "?thanks&sub") );
    }
    queue_timer = setTimeout(process_queue, 100);
  });

  setInterval(pageview, 1000 * 50);
})();