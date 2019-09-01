"use strict";
cc._RF.push(module, '05dc2tRAiFMobMbxaPK4NIf', 'ListenerManager');
// scripts/Manager/ListenerManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Delegate = /** @class */ (function () {
    function Delegate(listener, argArray, isOnce) {
        if (isOnce === void 0) { isOnce = false; }
        this.mIsOnce = false;
        this.mListener = listener;
        this.mArgArray = argArray;
        this.mIsOnce = isOnce;
    }
    Object.defineProperty(Delegate.prototype, "listener", {
        get: function () {
            return this.mListener;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Delegate.prototype, "argArray", {
        get: function () {
            return this.mArgArray;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Delegate.prototype, "isOnce", {
        get: function () {
            return this.mIsOnce;
        },
        set: function (isOnce) {
            this.mIsOnce = isOnce;
        },
        enumerable: true,
        configurable: true
    });
    return Delegate;
}());
exports.Delegate = Delegate;
var ListenerManager = /** @class */ (function () {
    function ListenerManager() {
        this.mListenerMap = new Map();
    }
    ListenerManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new ListenerManager();
        }
        return this.instance;
    };
    ListenerManager.prototype.has = function (type, caller, listener) {
        return this.find(type, caller, listener) !== null;
    };
    ListenerManager.prototype.trigger = function (type) {
        var argArray = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            argArray[_i - 1] = arguments[_i];
        }
        var _a;
        if (!type) {
            console.error("Listener type is null!");
            return false;
        }
        //cc.log("trigger " + type + (argArray.length > 0 ? ": " : "."), ...argArray);
        var delegateList = [];
        var callerList = [];
        var listenerMap = this.mListenerMap.get(type);
        if (listenerMap) {
            // for (let [caller, listenerList] of listenerMap) {
            // 	for (let delegate of listenerList) {
            // 		delegateList.push(delegate);
            // 		callerList.push(caller);
            // 	}
            // 	for (let index = listenerList.length - 1; index >= 0; --index) {
            // 		if (listenerList[index].isOnce) {
            // 			listenerList.splice(index, 1);
            // 		}
            // 	}
            // 	if (listenerList.length <= 0) {
            // 		listenerMap.delete(caller);
            // 	}
            // }
            listenerMap.forEach(function (listenerList, caller) {
                for (var _i = 0, listenerList_1 = listenerList; _i < listenerList_1.length; _i++) {
                    var delegate = listenerList_1[_i];
                    delegateList.push(delegate);
                    callerList.push(caller);
                }
                for (var index = listenerList.length - 1; index >= 0; --index) {
                    if (listenerList[index].isOnce) {
                        listenerList.splice(index, 1);
                    }
                }
                if (listenerList.length <= 0) {
                    listenerMap.delete(caller);
                }
            });
            if (listenerMap.size <= 0) {
                this.mListenerMap.delete(type);
            }
        }
        var length = delegateList.length;
        for (var index = 0; index < length; index++) {
            var delegate = delegateList[index];
            (_a = delegate.listener).call.apply(_a, [callerList[index]].concat(delegate.argArray, argArray));
        }
        return length > 0;
    };
    ListenerManager.prototype.add = function (type, caller, listener) {
        var argArray = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            argArray[_i - 3] = arguments[_i];
        }
        this.addListener.apply(this, [type, caller, listener, false].concat(argArray));
    };
    ListenerManager.prototype.addOnce = function (type, caller, listener) {
        var argArray = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            argArray[_i - 3] = arguments[_i];
        }
        this.addListener.apply(this, [type, caller, listener, true].concat(argArray));
    };
    ListenerManager.prototype.remove = function (type, caller, listener, onceOnly) {
        this.removeBy(function (listenerType, listenerCaller, delegate) {
            if (type && type !== listenerType) {
                return false;
            }
            if (caller && caller !== listenerCaller) {
                return false;
            }
            if (listener && listener !== delegate.listener) {
                return false;
            }
            if (onceOnly && !delegate.isOnce) {
                return false;
            }
            return true;
        });
    };
    ListenerManager.prototype.removeAll = function (caller) {
        var _this = this;
        // for (let [type, listenerMap] of this.mListenerMap) {
        // 	listenerMap.delete(caller);
        // 	if (listenerMap.size <= 0) {
        // 		this.mListenerMap.delete(type);
        // 	}
        // }
        this.mListenerMap.forEach(function (listenerMap, type) {
            listenerMap.delete(caller);
            if (listenerMap.size <= 0) {
                _this.mListenerMap.delete(type);
            }
        });
    };
    ListenerManager.prototype.addListener = function (type, caller, listener, isOnce) {
        var argArray = [];
        for (var _i = 4; _i < arguments.length; _i++) {
            argArray[_i - 4] = arguments[_i];
        }
        var delegate = this.find(type, caller, listener);
        if (delegate) {
            delegate.isOnce = isOnce;
            console.error("Listener is already exist!");
        }
        else {
            var delegate_1 = new Delegate(listener, argArray, isOnce);
            this.mListenerMap.get(type).get(caller).push(delegate_1);
        }
    };
    ListenerManager.prototype.removeBy = function (predicate) {
        var _this = this;
        if (!predicate) {
            return;
        }
        this.mListenerMap.forEach(function (listenerMap, type) {
            listenerMap.forEach(function (listenerList, caller) {
                for (var index = listenerList.length - 1; index >= 0; --index) {
                    var delegate = listenerList[index];
                    if (predicate(type, caller, delegate)) {
                        listenerList.splice(index, 1);
                    }
                }
                if (listenerList.length <= 0) {
                    listenerMap.delete(caller);
                }
            });
            if (listenerMap.size <= 0) {
                _this.mListenerMap.delete(type);
            }
        });
    };
    ListenerManager.prototype.find = function (type, caller, listener) {
        if (!type) {
            console.error("Listener type is null!");
            return null;
        }
        if (!caller) {
            console.error("Caller type is null!");
            return null;
        }
        if (!listener) {
            console.error("Listener is null!");
            return null;
        }
        var listenerMap;
        if (this.mListenerMap.has(type)) {
            listenerMap = this.mListenerMap.get(type);
        }
        else {
            listenerMap = new Map();
            this.mListenerMap.set(type, listenerMap);
        }
        var listenerList;
        if (listenerMap.has(caller)) {
            listenerList = listenerMap.get(caller);
        }
        else {
            listenerList = [];
            listenerMap.set(caller, listenerList);
        }
        for (var _i = 0, listenerList_2 = listenerList; _i < listenerList_2.length; _i++) {
            var delegate = listenerList_2[_i];
            if (delegate.mListener === listener) {
                return delegate;
            }
        }
        return null;
    };
    return ListenerManager;
}());
exports.ListenerManager = ListenerManager;

cc._RF.pop();