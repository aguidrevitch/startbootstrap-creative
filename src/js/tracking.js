(function () {
    var vars = window.location.search.substring(1).split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        document.cookie = '_url_param_' + pair[0] + '=' + pair[1] + '; max-age=' + 60*60*24*365;
    }

    window.addEventListener('DOMContentLoaded', function () {
        var query = [];
        var cookies = document.cookie.split(/; */);
        for (var j = 0; j < cookies.length; j++) {
            var pair = cookies[j].split('=');
            if (pair) {
                var matches = pair[0].match(/^_url_param_(.*)/);
                if (matches && matches[1]) {
                    query.push(matches[1] + "=" + pair[1]);
                }
            }
        }
        if (query.length) {
            var forms = document.querySelectorAll('iframe');
            for (var i = 0; i < iframes.length; i++) {
                if (iframes[i].src.match(/go\.abcfinancial\.com/)) {
                    var src = iframes[i].src.replace(/\?.*/, '');
                    iframes[i].src = src + '?' + query.join("&");
                }
            }
        }
    });
})();
