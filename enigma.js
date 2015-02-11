function Enigma() { }

Enigma.prototype.GetValue = function(element) {
  return jQuery(element).attr('data-enigmav');
};

Enigma.prototype.Replace = function(element) {
  var value = this.GetValue(element);
  if (!value) {
    return;
  }
  jQuery(element).replaceWith(eval('"' + value + '"'));
};

Enigma.prototype.Clickable = function(element) {
  var link = jQuery("<a />", {
    href : "#",
    text : jQuery(element).text(),
    'data-enigmav' : this.GetValue(element),
    onclick : 'javascript:new Enigma().Replace(this);return false;'
  });
  jQuery(element).replaceWith(link);
};

Enigma.prototype.IfReplied = function(element) {
  var cookie = document.cookie;
  var nameCap = /comment_author_[^=]*=([^;]+);/i.exec(cookie);
  if (nameCap === null || !(nameCap instanceof Array)) {
    return;
  }
  var found = false;
  jQuery('*').each(function(idx, element) {
    var text = jQuery(element).text();
    for (var i = 1; i < nameCap.length; ++i) {
      if (nameCap[i] === text) {
        found = true;
        break;
      }
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
