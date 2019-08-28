(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/Utils/MathExtension.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, '81407Q2vf9Ezor3KOYrFKb8', 'MathExtension', __filename);
// scripts/Utils/MathExtension.ts

Math.randomRangeInt = function (min, max) {
    var rand = Math.random();
    if (rand === 1) {
        rand -= Number.EPSILON;
    }
    return min + Math.floor(rand * (max - min));
};
Math.randomRangeFloat = function (min, max) {
    return min + (Math.random() * (max - min));
};
Math.fmod = function (x, y) {
    var temp = Math.floor(x / y);
    return x - temp * y;
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
        //# sourceMappingURL=MathExtension.js.map
        