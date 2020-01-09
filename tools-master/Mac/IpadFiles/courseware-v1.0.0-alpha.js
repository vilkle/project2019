// v1.0.0 alpha
; (function (window) {
    function getQueryString(isAddToGlobal, globalName) {
        var paramObject = {};
        var queryString = window.location.search.substr(1);
        var params = queryString.split("&");
        for (var i = 0, param; param = params[i++];) {
            param = param.split('=');
            param[0] = decodeURIComponent(param[0]);
            param[1] = decodeURIComponent(param[1]);
            paramObject[param[0]] = param[1];
        }
        if (isAddToGlobal) {
            globalName = globalName || '$_GET';
            window[globalName] = paramObject;
        }
        return paramObject;
    }

    var $_GET = getQueryString()
    var gid = 0
    var gEvents = {}
    var postMessageHandler = function (e) {
        if (e && e.data && e.data.id) {
            var events = gEvents[e.data.id];
            if (events) {
                // 执行对应的事件回调
                execHandlers(events[e.data.type], e.data)
                // 执行所有事件回调
                execHandlers(events['*'], e.data)
            }
        }
    }
    var execHandlers = function (handlers, data) {
        if (handlers && handlers.length) {
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i](data)
            }
        }
    }


    // 课件工厂
    var coursewareFactory = function (option) {
        if (!coursewareFactory._eventHasInit) {
            window.addEventListener("message", postMessageHandler, false);
            coursewareFactory._eventHasInit = true
        }
        return new Courseware(option)
    }

    // 课件类
    var Courseware = function (option) {
        this._gid = gid++
        this._option = option
        this.loaded = false
        this._init()
    }
    Courseware.prototype = {
        constructor: Courseware,
        _init: function () {
            this._getEl()
            this._createIframe()
        },
        _checkOption: function (option) {
            if (!option) {
                return false
            }
            if (!option.el) {
                return false
            }
            return true
        },
        _getEl: function () {
            if (typeof this._option.el == 'string') {
                this.el = document.querySelector(this._option.el)
            } else {
                this.el = this._option.el
            }
        },
        _createIframe: function () {
            if (!this.el) {
                return
            }
            var iframe = document.createElement('iframe')
            iframe.allowtransparency = true
            iframe.style.width = '100%'
            iframe.style.height = '100%'
            iframe.style.border = 'none'
            iframe.style.overflow = 'hidden'
            var that = this
            var url = this._option.url
            url = url + (url.indexOf('?') > -1 ? '&' : '?') + '__frame_id__=' + this._gid

            this.on('__sdk ready__', function () {
                that._pageSdkHasReady = true
                that.off('__sdk ready__')
            })

            iframe.onload = function (e) {
                setTimeout(function () {
                    if (that._pageSdkHasReady) {
                        that.emit('page load', e)
                    } else {
                        that.emit('page error', { code: 999999, message: 'iframe page init failed.' })
                    }
                }, 100)
            }

            iframe.src = url

            this.el.appendChild(iframe)
            // iframe.contentWindow.name = this._gid
            this._iframe = iframe
        },
        _getEvents: function () {
            if (gEvents[this._gid]) {
                return gEvents[this._gid]
            } else {
                return gEvents[this._gid] = {}
            }
        },
        on: function (evt, callback) {
            if (!evt) {
                return
            }
            var events = this._getEvents()
            if (events[evt]) {
                events[evt].push(callback)
            } else {
                events[evt] = [callback]
            }
        },
        off: function (evt, callback) {
            var events = this._getEvents()
            if (evt) {
                if (events[evt]) {
                    if (callback) {
                        var callbacks = events[evt]
                        for (var i = callbacks.length - 1; i > -1; i--) {
                            if (callbacks[i] === callback) {
                                callbacks.splice(i, 1)
                            }
                        }
                    } else {
                        delete events[evt]
                    }
                }
            } else {
                delete gEvents[this._gid]
            }
        },
        emit: function (evt, data) {
            var events = this._getEvents()
            if (events[evt] && events[evt].length) {
                var callbacks = events[evt]
                for (var i = callbacks.length - 1; i > -1; i--) {
                    callbacks[i](data)
                }
            }
        },
        send: function (evt, data) {
            if (this._iframe && this._iframe.contentWindow) {
                this._iframe.contentWindow.postMessage({
                    id: this._gid,
                    type: evt,
                    data: data,
                }, '*')
            }
        },
        destroy: function () {
            this.off()
            this._destroyIframe()
        },
        _destroyIframe: function () {
            if (this.el) {
                this.el.removeChild(this._iframe)
            }
        }
    }

    // 为课件增加iframe向外发送事件的工具函数
    var page = coursewareFactory.page = {}

    var pageEvents = {}

    var pagePostMessageHandler = function (e) {
        if (e && e.data) {
            // 执行对应的事件回调
            execHandlers(pageEvents[e.data.type], e.data)
            // 执行所有事件回调
            execHandlers(pageEvents['*'], e.data)
        }
    }

    // 向父页面postMessage
    page.sendToParent = function (type, data) {
        if (window.parent) {
            window.parent.postMessage({
                // id: window.name,
                id: $_GET['__frame_id__'],
                type: type,
                data: data,
            }, '*')
        }
    }

    // 告诉外面，初始化完成了
    page.sendToParent('__sdk ready__')

    // 监听父页面的事件
    page.on = function (evt, callback) {
        if (!evt) {
            return
        }
        if (!Object.keys(pageEvents).length) {
            window.addEventListener("message", pagePostMessageHandler, false)
        }
        var events = pageEvents
        if (events[evt]) {
            events[evt].push(callback)
        } else {
            events[evt] = [callback]
        }
    }



    window.courseware = coursewareFactory
})(window);

