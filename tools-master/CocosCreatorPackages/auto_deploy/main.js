'use strict';
let fs = require('fs')
let childProcess = require('child_process')
let path = require('path')
let http = require('http')

/** courseware中对应该课件的目录 */
let CoursewarePath = ''
/** 缺省git msg */
let GitLog = "CC plugin auto_deploy commit automatically."
/** 当前使用的Creator引擎路径 */
let EnginePath = ''
/**当前项目名称 */
let ProjectName = ''
/**配置路径 */
let configPath = __dirname + "/config.json";
/**历史配置 */
let ConfigData = {}
/**Jenkins信息 */
let JenkinsInfo = {
  host: '10.2.250.26',
  port: '8888'
}
/**当前构建任务id, string，初始值为空 */
let CurrentBuildId = ''
/**是否触发Jenkins构建 */
let IsTrigerJenkins = false

module.exports = {
  load() {
    //Editor.log(path.basename(Editor.Project.path))
    ProjectName = path.basename(Editor.Project.path)

    // 读取配置
    let str = fs.readFileSync(configPath, 'utf8');
    ConfigData = JSON.parse(str)
    if(ConfigData.distPath[ProjectName]){
      CoursewarePath = ConfigData.distPath[ProjectName]
    }
  },

  unload() {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
    'open'() {
      // open entry panel registered in package.json
      Editor.Panel.open('auto_deploy');

      /**
       * 关于'unpack://engine'
       * Mac:  /Applications/CocosCreator 2.1.2.app/Contents/Resources/engine
       * Windows: C:\CocosCreator_2.0.10\resources\engine
       */
      let tmpPath = Editor.url('unpack://engine')   
      if (Editor.isDarwin) {
        //  /Applications/CocosCreator 2.1.2.app/Contents/MacOS/CocosCreator
        EnginePath = tmpPath.replace('Resources/engine', 'MacOS/CocosCreator')
      } else {
        //  C:\CocosCreator_2.0.10\CocosCreator.exe
        EnginePath = tmpPath.replace('resources\\engine', 'CocosCreator.exe')
      }
      Editor.log(`Use Creator: ${EnginePath}`)
    },
    //panel界面准备完毕
    'ready'() {
      Editor.Ipc.sendToPanel('auto_deploy', 'defaultDistPath', CoursewarePath);
    },
    //设置发布路径
    'distPath'(arg1, arg2) {
      // Editor.log('收到消息', arg2)
      CoursewarePath = arg2;
      
      //保存配置
      ConfigData.distPath[ProjectName] = CoursewarePath
      fs.writeFileSync(configPath, JSON.stringify(ConfigData, null, '\t'));
    },
    //git 日志
    'gitLog'(arg1, arg2) {
      // Editor.log('收到消息', arg2)
      GitLog = "\"" + arg2 + "\"";
    },
    //是否Jenkins构建
    'jenkins_check'(arg1, arg2){
      //Editor.log('收到消息', arg2)
      IsTrigerJenkins = arg2
    },
    //构建发布
    'clicked'() {
      if (CoursewarePath == '') {
        Editor.Dialog.messageBox({
          type: 'warning',
          message: '请先选择发布目录'
        })
        return
      }

      cleanBuildDir(true, () => {
        cleanBuildDir(false, () => {
          modifyScript(true, () => {
            buildWebMobile(true, () => {
              modifyScript(false, () => {
                buildWebMobile(false, () => {
                  cleanCoursewarDir()
                })
              })
            })
          })
        })
      })
    }
  },
};

function cleanBuildDir(isTeacher, cbk) {
  let path = isTeacher ? Editor.Project.path + '/build/teacher' : Editor.Project.path + '/build/student'
  tryDeleteDir(path, cbk)
}

function tryDeleteDir(dir, cbk) {
  fs.exists(dir, (exist) => {
    if (exist) {
      Editor.log('删除目录 ' + dir)
      deleteFolderRecursive(dir)
    }
    cbk()
  })
}


function modifyScript(isTeacher, cbk) {
  Editor.log('设置ConstValue.ts ...', isTeacher ? '教师端' : '学生端');
  let scriptPath = Editor.assetdb.urlToFspath('db://assets/scripts/Data/ConstValue.ts')
  let script = fs.readFileSync(scriptPath, 'utf8');
  //Editor.log(script);
  script = script.replace('IS_EDITIONS = false', 'IS_EDITIONS = true');
  if (isTeacher) {
    script = script.replace('IS_TEACHER = false', 'IS_TEACHER = true');
  } else {
    script = script.replace('IS_TEACHER = true', 'IS_TEACHER = false');
  }
  //Editor.log(script)
  fs.writeFileSync(scriptPath, script)

  cbk();
}

function buildWebMobile(isTeacher, cbk) {
  Editor.log('构建 ...', isTeacher ? '教师端' : '学生端');
  let projectPath = Editor.Project.path
  let params, buildPath, startScene, command
  let allScenes = [], excludeScenes = []
  fs.readdirSync(Editor.assetdb.urlToFspath('db://assets/scene/')).forEach((file) => {
    //Editor.log(file)
    if (!file.endsWith('.meta')) {
      allScenes.push(file)
    }
  })
  //Editor.log('allScenes', allScenes)

  buildPath = projectPath + '/build'
  if (isTeacher) {
    startScene = Editor.assetdb.urlToUuid('db://assets/scene/Teacher.fire')
    //Editor.log(startScene)
  } else {
    startScene = Editor.assetdb.urlToUuid('db://assets/scene/Student.fire')
    //Editor.log(startScene)
  }
  allScenes.forEach((sceneFile) => {
    let uuid = Editor.assetdb.urlToUuid('db://assets/scene/' + sceneFile)
    if (uuid != startScene) {
      //除了开始场景，其他场景都不参与构建
      excludeScenes.push(uuid)
    }
  })
  //Editor.log('excludeScenes', excludeScenes)

  /**
   * 命令行构建参数不支持设置参与构建的场景，通过修改builder.json来实现
   */
  let jsonPath = projectPath + '/settings/builder.json'
  let jsonStr = fs.readFileSync(jsonPath, 'utf8');
  //Editor.log(jsonStr)
  let obj = JSON.parse(jsonStr)
  obj.excludeScenes = excludeScenes
  fs.writeFileSync(jsonPath, JSON.stringify(obj))

  params = `--path ${projectPath} --build "platform=web-mobile;debug=false;md5Cache=true;buildPath=${buildPath};startScene=${startScene}"`

  command = `${EnginePath} ${params}`

  childProcess.exec(command, (err, stdout, stderr) => {
    if (err) {
      Editor.error(err)
      return
    }
    let newName
    if (isTeacher) {
      newName = buildPath + '/teacher'
    } else {
      newName = buildPath + '/student'
    }
    fs.rename(buildPath + '/web-mobile', newName, (error) => {
      if (error) {
        Editor.error(error)
        return
      }
      cbk()
    })
  })
}

function cleanCoursewarDir() {
  tryDeleteDir(CoursewarePath + '/student', () => {
    tryDeleteDir(CoursewarePath + '/teacher', () => {
      gitPull()
    })
  })

}

function gitPull() {
  Editor.log('git pull...')
  let child = childProcess.spawn('git', ['pull'], {
    cwd: CoursewarePath
  })
  child.stdout.on('data', function (data) {
    // Editor.log(data.toString());
  });
  child.on('exit', function () {
    moveFolders()
  });
}

function moveFolders() {
  Editor.log('移动文件夹...')
  let buildPath = Editor.Project.path + '/build'
  fs.rename(buildPath + '/student', CoursewarePath + '/student', (error) => {
    if (error) {
      Editor.error(error)
      return
    }
    fs.rename(buildPath + '/teacher', CoursewarePath + '/teacher', (err) => {
      if (err) {
        Editor.error(err)
        return
      }
      gitAdd()
    })
  })
}

function gitAdd() {
  Editor.log('git add...')
  childProcess.exec("git add -A", {
    cwd: CoursewarePath
  }, (err, stdout, stderr) => {
    if (err) {
      Editor.error(err)
      return
    }
    gitCommit()
  })
}

function gitCommit() {
  Editor.log('git commit...')
  //git commit -m 'msg' -a
  childProcess.exec("git commit -m " + GitLog, {
    cwd: CoursewarePath
  }, (err, stdout, stderr) => {
    if (err) {
      Editor.error(err)
      return
    }
    gitPush()
  })
}

function gitPush() {
  Editor.log('git push...')
  childProcess.exec("git push", {
    cwd: CoursewarePath
  }, (err, stdout, stderr) => {
    if (err) {
      Editor.error(err)
      return
    }
    if(IsTrigerJenkins){
      trigerJenkins()
    }else{
      Editor.log('打包提交完成.')
    }
  })
}

function trigerJenkins(){
  Editor.log('Jenkins构建...')
  /**
   * 立即构建：10.2.250.26:8888/job/FE-Courseware/build?delay=0sec
   */
  if(!ConfigData.Account || ConfigData.Account == ''){
    Editor.warn('未配置 Account! 任务结束.')
    return
  }
  if(!ConfigData.Password || ConfigData.Password == ''){
    Editor.warn('未配置 Password! 任务结束.')
    return
  }

  CurrentBuildId = ''

  let options = {
    hostname: JenkinsInfo.host,
    port: JenkinsInfo.port,
    path: '/job/FE-Courseware/build?delay=0sec',
    auth: `${ConfigData.Account}:${ConfigData.Password}`,
    method: 'POST'
  }

  let req = http.request(options, (res)=>{
    Editor.log(`--响应状态码: ${res.statusCode}`)
    if(res.statusCode >= 200 && res.statusCode < 300){
      getBuildResult()
    }else{
      Editor.warn('构建请求失败，请手动构建!')
    }
  })

  req.on('error', (err)=>{
    Editor.warn('构建请求失败，请手动构建!')
    Editor.error(err)
  })

  req.end()
}

/**获取最后一次构建结果 */
function getBuildResult(){
  Editor.log("查询构建状态...")
  let options = {
    hostname: JenkinsInfo.host,
    port: JenkinsInfo.port,
    path: '/job/FE-Courseware/lastBuild/api/json',
    auth: `${ConfigData.Account}:${ConfigData.Password}`,
    method: 'GET'
  }

  let req = http.request(options, (res)=>{
    Editor.log(`--响应状态码: ${res.statusCode}`)
    res.setEncoding('utf8')

    let body = ''
    res.on('data', (chunk)=>{
      body += chunk
    })

    res.on('end', ()=>{
      let data = JSON.parse(body)
      if(CurrentBuildId == ''){
        CurrentBuildId = data.id
        Editor.log(`Job Id: #${CurrentBuildId}`)
        setTimeout(getBuildResult, 1000)
        return
      }else {
        if(data.id == CurrentBuildId){
          if(data.building){
            //正在构建
            let nowTimeStamp = new Date().getTime()
            let progress = (nowTimeStamp - data.timestamp)/data.estimatedDuration
            Editor.log('构建中...')
            Editor.log(`预计${data.estimatedDuration/1000}s  已耗时:${(nowTimeStamp - data.timestamp)/1000}s --- ${Math.floor(progress * 100)}%`)
            setTimeout(getBuildResult, 1000)
            return
          }else{
            if(data.result == 'SUCCESS'){
              Editor.log("构建完成.")
              return
            }else {
              Editor.warn("构建失败.")
              return
            }
          }
        }else {
          setTimeout(getBuildResult, 1000)
          return
        }
      }
    })
  })

  req.on('error', (err)=>{
    Editor.error(err)
  })

  req.end()
}

/**递归删除文件夹 */
function deleteFolderRecursive(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function (file) {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) { // recurse
        deleteFolderRecursive(curPath);
      } else { // delete file
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(path);
  }
};
