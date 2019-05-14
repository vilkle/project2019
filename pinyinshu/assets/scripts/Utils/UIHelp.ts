import { UIManager } from "../Manager/UIManager";
import { TipUI } from "../UI/panel/TipUI";
import { OverTips } from "../UI/Item/OverTips";

export class UIHelp
{
    public static showTip(message: string)
    {
        let tipUI = UIManager.getInstance().getUI(TipUI) as TipUI;
        if(!tipUI)
        {
            UIManager.getInstance().openUI(TipUI, 200, ()=>{
                UIHelp.showTip(message);
            });
        }
        else
        {
            tipUI.showTip(message);
        }
    }

    public static showOverTips(type:number, time:number,str:string,callback1?:any,callback2?:any)
    {
        let overTips = UIManager.getInstance().getUI(OverTips) as OverTips;
        if(!overTips)
        {
            UIManager.getInstance().openUI(OverTips, 200, ()=>{
                UIHelp.showOverTips(type,time,str,callback1,callback2);
            });
        }
        else
        {
           overTips.init(type, time, str, callback1,callback2);
        }
    }


    
}

