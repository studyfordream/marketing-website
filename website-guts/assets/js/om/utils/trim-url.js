window.optly.mrkt.utils = window.optly.mrkt.utils || {};

window.optly.mrkt.utils.trimTrailingSlash = function (str) {
    if(str.substr(-1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
};
