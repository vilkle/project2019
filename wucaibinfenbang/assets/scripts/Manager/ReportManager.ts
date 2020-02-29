/*
 * @Author: 马超
 * @Date: 2020-02-27 19:59:56
 * @LastEditTime: 2020-02-29 20:14:53
 * @Description: 上报数据管理类
 * @FilePath: \wucaibinfenbang\assets\scripts\Manager\ReportManager.ts
 */
import {AnswerResult} from "../Data/ConstValue"

export class ReportManager
{
    private static instance: ReportManager = null;

    public static getInstance(): ReportManager
    {
        if(this.instance == null)
        {
            this.instance = new ReportManager();
        }
        return this.instance;
    }
    private level: number = 0 //当前关卡排位
    private levelNum: number = 0 //总的关卡数
    private coastTimes: number = 0 //计时结束的时间
    private timeId: number = 0 //计时器timeout id
    private answerdata = { //上报数据结构
        type : 'text',
        index: 1,
        result: [

        ],
        gameOver: null
    }

/**
 * @description: 添加上报数据关卡信息
 * @param {number} num 关卡数目
 */
    addResult(num: number) {
        this.levelNum = num
        for(let i = 0; i < num; ++i) {
            this.answerdata.result.push({
                id: i + 1,
                question_info: '',
                answer_res: AnswerResult.NoAnswer,
                answer_num: 0,
                answer_time: '0s'

            })
        }
    }

/**
 * @description: 关卡开始数据更新
 * @param {boolean} isBreak 游戏过程中是否中断重连
 */
    levelStart(isBreak: boolean) {  
        if(this.answerdata.result.length == 0) {
            console.warn('There is no data in answerdata, please push result in answerdata first.')
            return
        }
        this.answerdata.result[this.level].question_info = ''
        this.answerdata.result[this.level].answer_res = AnswerResult.NoAnswer
        if(isBreak) {
            this.answerdata.result[this.level].answer_num += 0
            let time: string = this.answerdata.result[this.level].answer_time
            let len = time.length
            this.coastTimes = parseFloat(time.substring(0, len - 2)) * 100
            this.answerdata.result[this.level].answer_time = time
        }else {
            this.answerdata.result[this.level].answer_num += 1
            this.answerdata.result[this.level].answer_time = '0s'
            this.coastTimes = 0
        }
        if(this.timeId != null) {
            clearInterval(this.timeId)
        }
        this.timeId = setInterval(()=>{
            this.coastTimes += 1
        }, 100)
    }

/**
* @description: 关卡结束数据更新
* @param {AnswerResult} result 关卡完成情况
*/    
    levelEnd(result: AnswerResult) {
        if(this.answerdata.result.length == 0) {
            console.warn('There is no data in answerdata, please push result in answerdata first.')
            return
        }
        clearInterval(this.timeId)
        this.timeId = null
        console.log(this.level)
        this.answerdata.result[this.level].question_info = ''
        this.answerdata.result[this.level].answer_res = result
        this.answerdata.result[this.level].answer_num += 0
        this.answerdata.result[this.level].answer_time = (this.coastTimes/100).toString() + 's'
        this.answerdata.gameOver = null
        this.level ++
    }

/**
* @description: 游戏结束数据更新
*  @param {AnswerResult} result 关卡完成情况
*/
    gameOver(result: AnswerResult) {
        if(this.answerdata.result.length == 0) {
            console.warn('There is no data in answerdata, please push result in answerdata first.')
            return
        }
        this.levelEnd(result)
        this.answerdata.gameOver = {
            percentage: "0%",
            answer_all_state: AnswerResult.NoAnswer,
            answer_all_time: '0s',
            complete_degree: `0/${this.levelNum}`
        }
        let percentage = (this.level / this.levelNum).toFixed(2)
        this.answerdata.gameOver.percentage = `${percentage}%`
        if(parseFloat(percentage) == 0.00) {
            this.answerdata.gameOver.answer_all_state = AnswerResult.NoAnswer
        }else if(parseFloat(percentage) == 100.00) {
            this.answerdata.gameOver.answer_all_state = AnswerResult.AnswerRight
        }else {
            this.answerdata.gameOver.answer_all_state = AnswerResult.AnswerHalf
        }
        let time = 0
        for (const key in this.answerdata.result) {
            let timeStr = this.answerdata.result[key].answer_time
            let len = timeStr.length
            time += parseFloat(timeStr.substring(0, len - 2))
        }
        this.answerdata.gameOver.answer_all_time = `${time}s`
        this.answerdata.gameOver.complete_degree = `${this.level}/${this.levelNum}`
        console.log('answerdata------',this.answerdata)
    }

    answerHalf() {
        this.answerdata.result[this.level].answer_res = AnswerResult.AnswerHalf
    }

    getAnswerData(): any {
        return this.answerdata
    }

    getLevel(): number {
        return this.level
    }

    clearInterval() {
        if(this.timeId != null) {
            clearInterval(this.timeId)
        }
    }

}