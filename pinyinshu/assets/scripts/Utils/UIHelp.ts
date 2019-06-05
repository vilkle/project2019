import { UIManager } from "../Manager/UIManager";
import { TipUI } from "../UI/panel/TipUI";
import { AffirmTips } from "../UI/Item/AffirmTips";
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

    // public static showOverTips(type:number,str:string)
    // {
    //     let overTips = UIManager.getInstance().getUI(OverTips) as OverTips;
    //     if(!overTips)
    //     {
    //         UIManager.getInstance().openUI(OverTips, 200, ()=>{
    //             UIHelp.showOverTips(type,str);
    //         });
    //     }
    //     else
    //     {
    //        overTips.init(type, str);
    //     }
    // }
    public static showAffirmTips(type: number, des: string, time?:number,btnCloselDes?: string, btnOkDes?: string, callbackClose ?: any,callbackOk ?: any)
    {
        let affirmTips = UIManager.getInstance().getUI(AffirmTips) as AffirmTips;
        if(!affirmTips)
        {
            UIManager.getInstance().openUI(AffirmTips, 200, ()=>{
                UIHelp.showAffirmTips(type,des,time,btnCloselDes,btnOkDes,callbackClose,callbackOk);
            });
        }
        else
        {
            affirmTips.init(type,des,time,btnCloselDes,btnOkDes,callbackClose,callbackOk);
        }
    }

    
}

