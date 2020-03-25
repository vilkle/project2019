/*
 * @Author: 马超
 * @Date: 2020-02-27 19:59:56
 * @LastEditTime: 2020-03-19 12:09:13
 * @Description: 上报数据管理类
 * @FilePath: \guanchalifangti\assets\scripts\Manager\ReportManager.ts
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
    private degreeNum: number = 0
    private rightNum: number = 0 //正确关卡数
    private level: number = 0 //当前关卡排位
    private levelNum: number = 0 //总的关卡数
    private coastTimes: number = 0 //计时结束的时间
    private timeId: number = null //计时器timeout id
    private percentage: string = '0' //完成程度
    private answerdata = { //上报数据结构
        type : 'txt',
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

    setQuestionInfo(index: number, str: string) {
        this.answerdata.result[index].question_info = str
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
        this.level ++ 
        this.degreeNum = this.level - 1
        this.answerdata.result[this.level - 1].answer_res = AnswerResult.NoAnswer
        if(isBreak) {
            this.answerdata.result[this.level - 1].answer_num += 0
            let time: string = this.answerdata.result[this.level].answer_time
            let len = time.length
            this.coastTimes = parseFloat(time.substring(0, len - 2)) * 100
            this.answerdata.result[this.level - 1].answer_time = time
        }else {
            this.answerdata.result[this.level - 1].answer_num += 0
            this.answerdata.result[this.level - 1].answer_time = '0s'
            this.coastTimes = 0
        }
        if(this.timeId != null) {
            clearInterval(this.timeId)
        }
        this.timeId = setInterval(()=>{
            this.coastTimes += 1
        }, 10)
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
        if(result == AnswerResult.AnswerRight) {
            this.rightNum ++
        }
        this.timeId = null
        this.answerdata.result[this.level - 1].answer_res = result
        this.answerdata.result[this.level - 1].answer_num += 0
        this.answerdata.result[this.level - 1].answer_time = (this.coastTimes/100).toString() + 's'
        this.answerdata.gameOver = null
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
            answer_all_time: '1s',
            complete_degree: `0/${this.levelNum}`
        }
        let percentage: string = ''
        if(this.levelNum <= 1) {
            percentage = this.percentage
        }else {
            percentage = (this.rightNum / this.levelNum * 100).toFixed(2)
        }
        this.answerdata.gameOver.percentage = `${percentage}%`
        if(parseFloat(percentage) == 0.00) {
            if(this.answerdata.result[0].answer_res == AnswerResult.NoAnswer) {
                this.answerdata.gameOver.answer_all_state = AnswerResult.NoAnswer
            }else if(this.answerdata.result[0].answer_res == AnswerResult.AnswerHalf) {
                this.answerdata.gameOver.answer_all_state = AnswerResult.AnswerHalf
            }
        }else if(parseFloat(percentage) == 100.00) {
            this.answerdata.gameOver.answer_all_state = AnswerResult.AnswerRight
        }else {
            this.answerdata.gameOver.answer_all_state = AnswerResult.AnswerHalf
        }
        let time = 0
        for (const key in this.answerdata.result) {
            let timeStr = this.answerdata.result[key].answer_time
            let len = timeStr.length
            let str:string
            if(len == 2) {
                str = timeStr.substring(0)
            }else {
                str = timeStr.substring(0, len - 1)
            }
            time += parseFloat(str)
        }
        this.answerdata.gameOver.answer_all_time = `${time}s`
        this.answerdata.gameOver.complete_degree = `${this.degreeNum}\/${this.levelNum}`
        console.log('answerdata------',this.answerdata)
    }

    updateTime() {
        if(this.timeId != null) {
            this.answerdata.result[this.level - 1].answer_time = (this.coastTimes/100).toString() + 's'
        }
    }

    answerReset() {
        this.answerdata =  { 
            type : 'text',
            index: 1,
            result: [
    
            ],
            gameOver: null
        }
        this.addResult(this.levelNum)
        this.level = 0
        this.percentage = '0'
        this.degreeNum = 0
        this.rightNum = 0
        this.coastTimes = 0
        this.timeId = null
    }

    setPercentage(str : string) {
        this.percentage = str
    }

    isStart(): any {
        if(this.timeId != null) {
            return true
        }else {
            return false
        }
    }

    addLevel() {
        this.level ++
    }

    setLevel(num: number) {
        this.level = num
    }


    touchStart() {
        this.degreeNum = this.level
    }

    setAnswerNum(num: number) {
        this.answerdata.result[this.level - 1].answer_num = num
    }

    addAnswerNum() {
        this.answerdata.result[this.level - 1].answer_num ++
    }

    logAnswerdata() {
        console.log('answerdata-------:', this.answerdata)
    }

    answerHalf() {
        this.answerdata.result[this.level - 1].answer_res = AnswerResult.AnswerHalf
    }
    answerRight() {
        this.answerdata.result[this.level - 1].answer_res = AnswerResult.AnswerRight
    }

    answerWrong() {
        this.answerdata.result[this.level - 1].answer_res = AnswerResult.AnswerError
    }
    getAnswerData(): any {
        return this.answerdata
    }

    setAnswerData(data: any) {
        this.answerdata = data
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