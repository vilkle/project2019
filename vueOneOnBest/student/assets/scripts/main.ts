import Action from './Http/Action'
import DataReporting from './Data/DataReporting';
const $action = new Action()

const { ccclass, property } = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    @property(cc.Prefab)
    gamePanel: cc.Prefab = null;

    @property(cc.Prefab) //提示
    netTips: cc.Prefab = null;

    setNetTips(str: string, close: boolean = true) {
        let m = cc.instantiate(this.netTips);
        m.getComponent('tips').text = str;
        m.getComponent('tips').close = close;
        this.node.addChild(m);
    }
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        DataReporting.getInstance().dispatchEvent("load start");
        let loading = document.getElementById("loading-full");
        if (loading) loading.style.display = "none";
    }

    start() {
        DataReporting.getInstance().dispatchEvent("load end");
        let session = $action.getSession();
        let game = cc.instantiate(this.gamePanel);
        game.setPosition(cc.v2(0, 0));

        if (session) {
            game.getComponent('game').type = Number(session.type);
            game.getComponent('game').norm = Number(session.norm);
            game.getComponent('game').itemNumber = Number(session.count);
            game.getComponent('game').items = session.question;
            this.node.addChild(game);
        } else {
            // 如果 content 不存在，则为学生端，发送请求获取数据
            $action.getQuery();
            $action.getCourseContent(this.setNetTips).then((res: any) => {
                let content;
                if (res.errcode == 0) {
                    content = JSON.parse(res.data.courseware_content);
                    game.getComponent('game').type = Number(content.type);
                    game.getComponent('game').norm = Number(content.norm);
                    game.getComponent('game').itemNumber = Number(content.count);
                    game.getComponent('game').items = content.question;
                    this.node.addChild(game);
                } else {
                    this.setNetTips(res.errmsg);
                }
            }).catch((err: any) => {
                this.setNetTips('网络错误');
            });
        }
    }

    // update (dt) {}
}
