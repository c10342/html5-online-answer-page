
workbox.core.setCacheNameDetails({prefix: "vue-pwa"});

self.__precacheManifest = [].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

// 动态ajax请求缓存
workbox.routing.registerRoute(function(obj){
    let pathname = obj.url.pathname
    if(pathname.startsWith('/api/user/login') || pathname.startsWith('/api/user/register') || pathname.startsWith('/api/user/sendCode')){
        return false
    }
    // true缓存，false不缓存，这样可以选择缓存那些请求
    return true
},workbox.strategies.networkFirst())
// workbox.strategies.cacheFirst()缓存优先
// workbox.strategies.networkFirst()网络优先
