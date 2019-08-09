import { UIManager } from "../Manager/UIManager";
import { TipUI } from "../UI/panel/TipUI";
import { AffirmTips } from "../UI/Item/affirmTips";
import { OverTips } from "../UI/Item/OverTips";

export class UIHelp {
    /**
     * 
     * @param message tips文字内容
     * @param type tips类型  0:内容tips   1:系统tips
     */
    public static showTip(message: string) {
        let tipUI = UIManager.getInstance().getUI(TipUI) as TipUI;
        if (!tipUI) {
            UIManager.getInstance().openUI(TipUI, 211, null,() => {
                UIHelp.showTip(message);
            });
        }
        else {
            tipUI.showTip(message);
        }
    }

     /**
     * 结束tip
     * @param message tips文字内容
     * @param type tips类型  0:内容tips   1:系统tips
     */
    public static showOverTip(type:number, str:string="", btnStr:string="", callback:Function =null, btnCallBack:Function=null) {
        let overTips = UIManager.getInstance().getUI(OverTips) as OverTips;
        if (!overTips) {
            UIManager.getInstance().openUI(OverTips, 210, null,() => {
                UIHelp.showOverTip(type, str, btnStr, callback, btnCallBack);
            });
        }
        else {
            overTips.init(type, str, btnStr, callback, btnCallBack);
        }
    }

     /**
     * 二次确认框
     * @param message tips文字内容
     * @param type tips类型  0:内容tips   1:系统tips
     */
    public static AffirmTip(type: number, des: string, callbackClose: any, callbackOk: any,btnCloselDes?: string, btnOkDes?: string, num ?: number) {
        let overTips = UIManager.getInstance().getUI(AffirmTips) as AffirmTips;
        if (!overTips) {
            UIManager.getInstance().openUI(AffirmTips, 210, null,() => {
                UIHelp.AffirmTip(type, des,callbackClose, callbackOk,btnCloselDes,btnOkDes, num);
            });
        }
        else {
            overTips.init(type, des,callbackClose, callbackOk, btnCloselDes,btnOkDes,num);
        }
    }


}

