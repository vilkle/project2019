(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/main.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'c8797Ywx1hNvZg+VPef0XbE', 'main', __filename);
// scripts/main.ts

Object.defineProperty(exports, "__esModule", { value: true });
var Action_1 = require("./Http/Action");
var DataReporting_1 = require("./Data/DataReporting");
var $action = new Action_1.default();
var _a = cc._decorator, ccclass = _a.ccclass, property = _a.property;
var Main = /** @class */ (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.gamePanel = null;
        _this.netTips = null;
        return _this;
        // update (dt) {}
    }
    Main.prototype.setNetTips = function (str, close) {
        if (close === void 0) { close = true; }
        var m = cc.instantiate(this.netTips);
        m.getComponent('tips').text = str;
        m.getComponent('tips').close = close;
        this.node.addChild(m);
    };
    // LIFE-CYCLE CALLBACKS:
    Main.prototype.onLoad = function () {
        DataReporting_1.default.getInstance().dispatchEvent("load start");
        var loading = document.getElementById("loading-full");
        if (loading)
            loading.style.display = "none";
    };
    Main.prototype.start = function () {
        var _this = this;
        DataReporting_1.default.getInstance().dispatchEvent("load end");
        var session = $action.getSession();
        var game = cc.instantiate(this.gamePanel);
        game.setPosition(cc.v2(0, 0));
        if (session) {
            game.getComponent('game').type = Number(session.type);
            game.getComponent('game').norm = Number(session.norm);
            game.getComponent('game').itemNumber = Number(session.count);
            game.getComponent('game').items = session.question;
            this.node.addChild(game);
        }
        else {
            // 如果 content 不存在，则为学生端，发送请求获取数据
            $action.getQuery();
            $action.getCourseContent(this.setNetTips).then(function (res) {
                var content;
                if (res.errcode == 0) {
                    content = JSON.parse(res.data.courseware_content);
                    game.getComponent('game').type = Number(content.type);
                    game.getComponent('game').norm = Number(content.norm);
                    game.getComponent('game').itemNumber = Number(content.count);
                    game.getComponent('game').items = content.question;
                    _this.node.addChild(game);
                }
                else {
                    _this.setNetTips(res.errmsg);
                }
            }).catch(function (err) {
                _this.setNetTips('网络错误');
            });
        }
    };
    __decorate([
        property(cc.Prefab)
    ], Main.prototype, "gamePanel", void 0);
    __decorate([
        property(cc.Prefab) //提示
    ], Main.prototype, "netTips", void 0);
    Main = __decorate([
        ccclass
    ], Main);
    return Main;
}(cc.Component));
exports.default = Main;

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
        //# sourceMappingURL=main.js.map
        