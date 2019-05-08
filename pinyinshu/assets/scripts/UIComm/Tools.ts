// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export class Tools  {
   /**
     * 播放spine动画
     * @param {*} sp_Skeleton 动画文件
     * @param {*} animName 动作名称
     * @param {*} loop 是否循环
     * @param {*} callback 播放完毕回调
     */
    public static playSpine(sp_Skeleton:sp.Skeleton,animName:string,loop:boolean,callback:any=null) {
        sp_Skeleton.premultipliedAlpha=false;//这样设置在cocos creator中才能有半透明效果
        
        // let spine = this.node.getComponent(sp.Skeleton);
        let track = sp_Skeleton.setAnimation(0, animName, loop);
        if (track) {
            // 注册动画的结束回调
            sp_Skeleton.setCompleteListener((trackEntry, loopCount) => {
                let name = trackEntry.animation ? trackEntry.animation.name : '';
                if (name === animName && callback&&callback!=null) {
                   // console.log("动画回调");
                    callback(); // 动画结束后执行自己的逻辑
                }
            });
        }
    }

    //参数获取
    public static getQueryVariable(variable:string) {
        var query = window.location.href;
        var vars = query.split("?");
        if(vars.length<2)
        return false;
        var vars = vars[1].split("&");
       
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }

}
