"use strict";
cc._RF.push(module, '16d7aVnmU1PQrpFj9P1Fxvb', 'AudioManager');
// scripts/Manager/AudioManager.ts

Object.defineProperty(exports, "__esModule", { value: true });
var ConstValue_1 = require("../Data/ConstValue");
var AudioManager = /** @class */ (function () {
    function AudioManager() {
        this.bgm = "";
    }
    AudioManager.getInstance = function () {
        if (this.instance == null) {
            this.instance = new AudioManager();
        }
        return this.instance;
    };
    /**
     * 播放音频文件
     * @param soundName 音频名字
     * @param loop 是否循环
     * @param volume 音量大小
     * @param audioIdCbk 回传播放的音频的AudioID
     * @param endCbk 音频播放结束的回调
     */
    AudioManager.prototype.playSound = function (soundName, loop, volume, audioIdCbk, endCbk) {
        if (audioIdCbk === void 0) { audioIdCbk = null; }
        if (endCbk === void 0) { endCbk = null; }
        // if(GameDataManager.getInstance().getGameData().playerInfo.closeAudio)
        // {
        //     return;
        // }
        var path = ConstValue_1.ConstValue.AUDIO_DIR + soundName;
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if (err) {
                cc.error(err);
                return;
            }
            var audioID = cc.audioEngine.play(clip, loop ? loop : false, volume ? volume : 1);
            //LogWrap.log('playSound: ', path)
            if (audioIdCbk) {
                audioIdCbk(audioID);
            }
            if (endCbk) {
                cc.audioEngine.setFinishCallback(audioID, endCbk);
            }
        });
    };
    /**
     * 停止播放指定的音频
     * @param audioId
     */
    AudioManager.prototype.stopAudio = function (audioId) {
        cc.audioEngine.stop(audioId);
    };
    /**
     * 停止正在播放的所有音频
     */
    AudioManager.prototype.stopAll = function () {
        cc.audioEngine.stopAll();
    };
    /**
     * 暂停现在正在播放的所有音频
     */
    AudioManager.prototype.pauseAll = function () {
        cc.audioEngine.pauseAll();
    };
    /**
     * 恢复播放所有之前暂停的所有音频
     */
    AudioManager.prototype.resumeAll = function () {
        cc.audioEngine.resumeAll();
    };
    /**
     * 播放背景音乐
     * @param soundName 背景音乐文件名
     */
    AudioManager.prototype.playBGM = function (soundName) {
        if (this.bgm == soundName) {
            return;
        }
        this.bgm = soundName;
        // if(GameDataManager.getInstance().getGameData().playerInfo.closeAudio)
        // {
        //     return;
        // }
        cc.audioEngine.stopMusic();
        var path = ConstValue_1.ConstValue.AUDIO_DIR + soundName;
        //cc.audioEngine.play(cc.url.raw(path), loop?loop:false, volume?volume:1);
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if (err) {
                cc.error(err);
                return;
            }
            cc.audioEngine.playMusic(clip, true);
        });
    };
    /**
     * 重新开始播放背景音乐
     */
    AudioManager.prototype.resumeBGM = function () {
        cc.audioEngine.stopMusic();
        var path = ConstValue_1.ConstValue.AUDIO_DIR + this.bgm;
        cc.loader.loadRes(path, cc.AudioClip, function (err, clip) {
            if (err) {
                cc.error(err);
                return;
            }
            cc.audioEngine.playMusic(clip, true);
        });
    };
    AudioManager.instance = null;
    return AudioManager;
}());
exports.AudioManager = AudioManager;

cc._RF.pop();