"use strict";
cc._RF.push(module, '615f7lsxLNDWJSqVJoRIFW3', 'LogWrap');
// scripts/Utils/LogWrap.ts

Object.defineProperty(exports, "__esModule", { value: true });
var OPENLOGFLAG = true;
var LogWrap = /** @class */ (function () {
    function LogWrap() {
    }
    LogWrap.getDateString = function () {
        var d = new Date();
        var str = d.getHours().toString();
        var timeStr = "";
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMinutes().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getSeconds().toString();
        timeStr += (str.length == 1 ? "0" + str : str) + ":";
        str = d.getMilliseconds().toString();
        if (str.length == 1)
            str = "00" + str;
        if (str.length == 2)
            str = "0" + str;
        timeStr += str;
        timeStr = "[" + timeStr + "]";
        return timeStr;
    };
    LogWrap.stack = function (index) {
        var e = new Error();
        var lines = e.stack.split("\n");
        lines.shift();
        var result = [];
        lines.forEach(function (line) {
            var _a;
            line = line.substring(7);
            var lineBreak = line.split(" ");
            if (lineBreak.length < 2) {
                result.push(lineBreak[0]);
            }
            else {
                result.push((_a = {}, _a[lineBreak[0]] = lineBreak[1], _a));
            }
        });
        var list = [];
        if (index < result.length - 1) {
            for (var a in result[index]) {
                list.push(a);
            }
        }
        var splitList = list[0].split(".");
        return (splitList[0] + ".js->" + splitList[1] + ": ");
    };
    LogWrap.log = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var backLog = console.log || cc.log; // || log;
        if (OPENLOGFLAG) {
            backLog.call(this, "%s%s:" + cc.js.formatStr.apply(cc, arguments), LogWrap.stack(2), LogWrap.getDateString());
        }
    };
    LogWrap.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var backLog = console.log || cc.log; // || log;
        if (OPENLOGFLAG) {
            backLog.call(this, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments), "color:#00CD00;", LogWrap.stack(2), LogWrap.getDateString());
        }
    };
    LogWrap.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var backLog = console.log || cc.log; // || log;
        if (OPENLOGFLAG) {
            backLog.call(this, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments), "color:#ee7700;", LogWrap.stack(2), LogWrap.getDateString());
            //cc.warn
        }
    };
    LogWrap.err = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var backLog = console.log || cc.log; // || log;
        if (OPENLOGFLAG) {
            backLog.call(this, "%c%s%s:" + cc.js.formatStr.apply(cc, arguments), "color:red", LogWrap.stack(2), LogWrap.getDateString());
        }
    };
    return LogWrap;
}());
exports.LogWrap = LogWrap;

cc._RF.pop();