import { UIManager } from "../Manager/UIManager";
import { ListenerManager } from "../Manager/ListenerManager";
import { ListenerType } from "../Data/ListenerType";
import { LogWrap } from "../Utils/LogWrap";
import { NetWork } from "../Http/NetWork";
import { LoadingUI } from "../UI/panel/LoadingUI";

const {ccclass, property} = cc._decorator;

@ccclass
export class GameMain extends cc.Component {

    onLoad() {
        let loading = document.getElementById("loading-full");
        if (loading) {
            loading.style.display = "none";
        }
    }

    start() {
        var Request = new Object();
        Request = NetWork.getInstance().GetRequest();
        NetWork.courseware_id = Request["id"];
        NetWork.title_id = Request["title_id"];
        NetWork.user_id = Request["user_id"];
    }

    update(dt) {
        
    }
}