(function() {
  function Enigma() { }

  Enigma.prototype.GetValue = function(element) {
    return jQuery(element).attr('data-enigmav');
  };
  
  Enigma.prototype.Replace = function(element) {
    var value = this.GetValue(element);
    if (!value) {
      return;
    }
    jQuery(element).replaceWith(jQuery.parseJSON('"' + value + '"'));
  };
  
  Enigma.prototype.Clickable = function(element) {
    var thisEnigma = this;
    var link = jQuery("<a />", {
      href : "#",
      text : jQuery(element).text(),
      'data-enigmav' : this.GetValue(element)
    });
    jQuery(element).replaceWith(link);
    jQuery(link).on('click', function() {
      thisEnigma.Replace(link);
      return false;
    });
  };
  
  Enigma.prototype.IfReplied = function(element) {
    var pattern = /comment_author_[^=]*=([^;]+);/g;
    var cookie = document.cookie;
    var nameCap = [];
    var names = {};
    while ((nameCap = pattern.exec(cookie)) !== null) {
      names[nameCap[1]] = true;
      var decodedName = decodeURIComponent(nameCap[1]);
      if (decodedName !== nameCap[1]) {
        names[decodedName] = true;
      }
    }
    if (jQuery.isEmptyObject(names)) {
      return;
    }
    var found = false;
    jQuery('*').each(function(idx, element) {
      var text = jQuery(element).text();
      if (names[text]) {
        found = true;
        return false;
      }
    });
    if (found) {
      this.Replace(element);
    }
  };
  
  Enigma.prototype.Run = function() {
    var thisEnigma = this;
    jQuery('span[id^="engimadiv"]').each(function(idx, element) {
      if (jQuery(element).attr('data-enigmad') === 'y') {
        return thisEnigma.Clickable(element);
      } else if (jQuery(element).attr('data-enigmad') === 'replied') {
        return thisEnigma.IfReplied(element);
      }
      thisEnigma.Replace(element);
    });
  };
  
  jQuery(function() {
    new Enigma().Run();
    setInterval(function() { new Enigma().Run();}, 2000);
  });
})();
