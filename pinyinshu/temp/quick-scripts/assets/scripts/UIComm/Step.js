(function() {"use strict";var __module = CC_EDITOR ? module : {exports:{}};var __filename = 'preview-scripts/assets/scripts/UIComm/Step.js';var __require = CC_EDITOR ? function (request) {return cc.require(request, require);} : function (request) {return cc.require(request, __filename);};function __define (exports, require, module) {"use strict";
cc._RF.push(module, 'ec260b7b1dBQYLxfWoMa0cz', 'Step', __filename);
// scripts/UIComm/Step.js

"use strict";

cc.Class({
    extends: cc.Component,

    properties: {
        node_title: cc.Node, // prefab
        node_parent: cc.Node, //节点的父级
        _stepNode: [],
        NowIndex: -1
    },

    Init: function Init(data) {
        for (var i = 0; i < data.length; i++) {
            var obj = cc.instantiate(this.node_title);
            obj.setParent(this.node_parent);
            obj.children[1].getComponent(cc.Label).string = i.toString();
            obj.children[3].getComponent(cc.Label).string = data[i].des;
            obj.active = true;
            if (i + 1 >= data.length) {
                obj.children[2].active = false;
                obj.setContentSize(30, 30);
            }
            this._stepNode.push(obj);
        };

        this.NextStep();
    },
    SetNowPos: function SetNowPos(type) {},
    NextStep: function NextStep() {
        if (this.NowIndex + 1 >= this._stepNode.length) {
            return;
        }
        if (this.NowIndex >= 0) {
            this._stepNode[this.NowIndex].children[2].color = new cc.Color(122, 170, 229);
        }
        this._stepNode[this.NowIndex + 1].children[0].color = new cc.Color(122, 170, 229);
        this.NowIndex++;
    },
    LestStep: function LestStep() {

        if (this.NowIndex - 1 < 0) {
            return;
        }
        if (this.NowIndex - 1 >= 0) {
            this._stepNode[this.NowIndex - 1].children[2].color = new cc.Color(129, 129, 129);
        }
        this._stepNode[this.NowIndex].children[0].color = new cc.Color(129, 129, 129);
        this.NowIndex--;
    },
    start: function start() {
        var data = [];
        var DataDes = ["录入题目信息", "检测题目信息"];
        for (var i = 0; i < DataDes.length; i++) {
            var tiitle = [];
            tiitle.des = DataDes[i];
            data.push(tiitle);
        };

        this.Init(data);
    },


    //
    ReStart: function ReStart() {}
});

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
        //# sourceMappingURL=Step.js.map
        