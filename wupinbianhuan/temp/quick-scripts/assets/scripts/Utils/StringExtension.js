(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Utils/StringExtension.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '85c1bk+r3FHf5RqunqKCFt+', 'StringExtension', __filename);
// scripts/Utils/StringExtension.ts

String.prototype.format = function () {
    var param = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        param[_i] = arguments[_i];
    }
    //将arguments转化为数组（ES5中并非严格的数组）
    var args = Array.prototype.slice.call(arguments);
    var count = 0;
    //通过正则替换%s
    return this.replace(/%s/g, function (s, i) {
        return args[count++];
    });
};

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
        //# sourceMappingURL=StringExtension.js.map
        