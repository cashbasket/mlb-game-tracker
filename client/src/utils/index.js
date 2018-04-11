// Borrwed (with love) from http://locutus.io/php/strip_tags/
export default {
  stripTags: (input, allowed) => { 
  // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
    allowed = (((allowed || '') + '').toLowerCase().match(/<[a-z][a-z0-9]*>/g) || []).join('');
  
    var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi;
    var commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  
    var before = input;
    var after = input;
    // recursively remove tags to ensure that the returned string doesn't contain forbidden tags after previous passes (e.g. '<<bait/>switch/>')
    while (true) {
      before = after;
      after = before.replace(commentsAndPhpTags, '').replace(tags, function ($0, $1) {
        return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
      });
  
      // return once no more tags are removed
      if (before === after) {
        return after;
      }
    }
  }
};