;(function () {
    var isReady = false
    var readyHandles = []
    
    window.bridgeReady = function (callback) {
        if (isReady) {
            callback(bridge)
        } else {
            readyHandles.push(callback)
        }
    }

    function setupWebViewJavascriptBridge(callback) {
         //第一次调用这个方法的时候，为false
        if (window.WebViewJavascriptBridge) {
            var result = callback(WebViewJavascriptBridge);
            return result;
        }
        //第一次调用的时候，也是false
        if (window.WVJBCallbacks) {
            var result = window.WVJBCallbacks.push(callback);
            return result;
        }
        //把callback对象赋值给对象。
        window.WVJBCallbacks = [callback];
        //这段代码的意思就是执行加载WebViewJavascriptBridge_JS.js中代码的作用
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() {
            document.documentElement.removeChild(WVJBIframe)
        }, 0);
    }
    
    //setupWebViewJavascriptBridge执行的时候传入的参数，这是一个方法。
    function callback(_bridge) {
        window.bridge = _bridge
        isReady = true
        for (var i=0,len=readyHandles.length; i<len; i++) {
            readyHandles[i](_bridge)
        }
        /* 
            var uniqueId = 1
            //把WEB中要注册的方法注册到bridge里面
            bridge.registerHandler('OC调用JS提供的方法', function(data, responseCallback) {
                log('OC调用JS方法成功', data)
                var responseData = { 'JS给OC调用的回调':'回调值!' }
                log('OC调用JS的返回值', responseData)
                responseCallback(responseData)
            })
            $('#brage').on('click', function () {
                bridge.callHandler('OC提供方法给JS调用',params, function(response) {
                    log('JS调用OC的返回值', response)
                })
            })
        */
    };
    //驱动所有hander的初始化
    setupWebViewJavascriptBridge(callback);

})(window);


