/*
 * @Author: 马超
 * @Date: 2020-04-27 11:26:32
 * @LastEditTime: 2020-05-07 17:11:53
 * @Description: 游戏脚本
 * @FilePath: \xunzhaogao\assets\scripts\Data\DaAnData.ts
 */
export class DaAnData {
    private static instance: DaAnData;
  
    public submitEnable = true;
   
    static getInstance() {
        if (this.instance == null) {
            this.instance = new DaAnData();
        }
        return this.instance;
    }
}