import { UIManager } from "../Manager/UIManager";
import { TipUI } from "../UI/panel/TipUI";
import {OverTips} from "../UI/Item/OverTips"

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

    public static showOverTips(type:number,str:string,callback:any)
    {
        let overTips = UIManager.getInstance().getUI(OverTips) as OverTips;
        if(!overTips)
        {
            UIManager.getInstance().openUI(OverTips, 200, ()=>{
                UIHelp.showOverTips(type,str,callback);
            });
        }
        else
        {
           overTips.init(type,str,callback);
        }
    }

}

