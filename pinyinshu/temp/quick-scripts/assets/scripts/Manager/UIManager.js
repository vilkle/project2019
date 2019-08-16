(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Manager/UIManager.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'fcb706mngZPXIeAjofYaIuT', 'UIManager', __filename);
// scripts/Manager/UIManager.ts

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UIManager = /** @class */ (function () {
    function UIManager() {
        this.uiList = [];
        this.uiRoot = null;
        this.uiRoot = cc.find("Canvas");
    }
    UIManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new UIManager();
        }
        return this.instance;
    };
    UIManager.prototype.openUI = function (uiClass, data, zOrder, callback, onProgress) {
        var _this = this;
        var args = [];
        for (var _i = 5; _i < arguments.length; _i++) {
            args[_i - 5] = arguments[_i];
        }
        if (this.getUI(uiClass)) {
            return;
        }
        cc.loader.loadRes(uiClass.getUrl(), function (completedCount, totalCount, item) {
            if (onProgress) {
                onProgress(completedCount, totalCount, item);
            }
        }, function (error, prefab) {
            if (error) {
                cc.log(error);
                return;
            }
            if (_this.getUI(uiClass)) {
                return;
            }
            var uiNode = cc.instantiate(prefab);
            uiNode.parent = _this.uiRoot;
            //zOrder && uiNode.setLocalZOrder(zOrder);
            if (zOrder) {
                uiNode.zIndex = zOrder;
            }
            var ui = uiNode.getComponent(uiClass);
            ui.data = data;
            ui.tag = uiClass;
            _this.uiList.push(ui);
            if (callback) {
                callback(args);
            }
        });
    };
    UIManager.prototype.closeUI = function (uiClass) {
        for (var i = 0; i < this.uiList.length; ++i) {
            if (this.uiList[i].tag === uiClass) {
                this.uiList[i].node.destroy();
                this.uiList.splice(i, 1);
                return;
            }
        }
    };
    UIManager.prototype.showUI = function (uiClass, data, callback) {
        var _this = this;
        var ui = this.getUI(uiClass);
        if (ui) {
            ui.data = data;
            ui.node.active = true;
            ui.onShow();
            if (callback) {
                callback();
            }
        }
        else {
            this.openUI(uiClass, data, 0, function () {
                callback && callback();
                var ui = _this.getUI(uiClass);
                ui.onShow();
            });
        }
    };
    UIManager.prototype.hideUI = function (uiClass) {
        var ui = this.getUI(uiClass);
        if (ui) {
            ui.node.active = false;
        }
    };
    UIManager.prototype.getUI = function (uiClass) {
        for (var i = 0; i < this.uiList.length; ++i) {
            if (this.uiList[i].tag === uiClass) {
                return this.uiList[i];
            }
        }
        return null;
    };
    return UIManager;
}());
exports.UIManager = UIManager;

cc._RF.pop();
        }
        if (CC_EDITOR) {
            __define(__module.exports, __require, __module);
        }
        else {
            cc.registerModuleFunc(__filename, function () {
                __define(__module.exports, __require, __module);
            });
        }
        })();
        //# sourceMappingURL=UIManager.js.map
        