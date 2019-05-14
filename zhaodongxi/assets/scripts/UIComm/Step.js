

cc.Class({
    extends: cc.Component,

    properties: {
        node_title:cc.Node, // prefab
        node_parent:cc.Node, //节点的父级
        _stepNode:[],
        NowIndex:-1,
    },

    Init(data){
        for(let i = 0; i<data.length; i++){
            let obj = cc.instantiate(this.node_title);
            obj.setParent(this.node_parent);
            obj.children[1].getComponent(cc.Label).string = i.toString();
            obj.children[3].getComponent(cc.Label).string = data[i].des;
            obj.active = true;
            if(i+1>= data.length){
                obj.children[2].active = false;
                obj.setContentSize(30,30);
            }
            this._stepNode.push(obj);
        };

        this.NextStep();

    },

    SetNowPos(type){},

    NextStep(){
        if(this.NowIndex + 1 >= this._stepNode.length){
            return;
        }
        if(this.NowIndex >= 0){
            this._stepNode[this.NowIndex].children[2].color = new cc.Color(122, 170, 229);
        }
        this._stepNode[this.NowIndex+1].children[0].color = new cc.Color(122, 170, 229);
        this.NowIndex++;
    },

    LestStep(){

        if(this.NowIndex - 1 <0){
            return;
        }
        if(this.NowIndex-1 >= 0){
        this._stepNode[this.NowIndex-1].children[2].color = new cc.Color(129, 129, 129);
        }
        this._stepNode[this.NowIndex].children[0].color = new cc.Color(129, 129, 129);
        this.NowIndex--;
    },

    


   

    start () {
        let data =[];
        let DataDes = ["录入题目信息","检测题目信息"];
        for(let i = 0; i<DataDes.length;i++){
            let tiitle = [];
            tiitle.des = DataDes[i];
            data.push(tiitle);
        };

        this.Init(data);
    },

    //
    ReStart(){
        



    },

});
