"use strict";
cc._RF.push(module, '85c1bk+r3FHf5RqunqKCFt+', 'StringExtension');
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