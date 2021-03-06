(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Http/Action.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '8a4c1enmVJN/aj0onMy65P5', 'Action', __filename);
// scripts/Http/Action.ts

Object.defineProperty(exports, "__esModule", { value: true });
var NetWork_1 = require("./NetWork");
var $http = NetWork_1.NetWork.getInstance();
var Action = /** @class */ (function () {
    function Action() {
        this.sessionKey = 'local_form_data';
    }
    Action.prototype.getSession = function () {
        // 教师端预览时从浏览器缓存中取数据
        return JSON.parse(sessionStorage.getItem(this.sessionKey));
    };
    Action.prototype.getQuery = function () {
        // 从URL获取参数
        var query = $http.GetRequest();
        $http.courseware_id = query['id'];
        $http.title_id = query['title_id'];
        $http.user_id = query['user_id'];
    };
    Action.prototype.getCourseContent = function (setTips) {
        return new Promise(function (resolve, reject) {
            $http.httpRequest(NetWork_1.NetWork.GET_QUESTION + "?courseware_id=" + $http.courseware_id, 'GET', 'application/json;charset=utf-8', function (err, response) {
                if (err) {
                    reject(err);
                }
                else {
                    var res = JSON.parse(response);
                    // resolve(res.data.courseware_content);
                    resolve(res);
                }
            });
        });
    };
    return Action;
}());
exports.default = Action;

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
        //# sourceMappingURL=Action.js.map
        