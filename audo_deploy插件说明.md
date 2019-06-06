## CocosCreator插件auto_deploy说明

### 功能
- 自动修改ConstValue.ts
- 自动设置正确的学生端和教师端场景进行构建
- 将构建后的学生端和教师端文件夹替换到courseware仓库并提交

### 怎么使用？
1. 拷贝 gameFrame/packages/auto_deploy 文件夹到自己工程 packages 下
2. 从编辑器工具栏 '扩展/audo_deploy/open' 打开插件面板
3. 点击'选择目录'按钮选择courseware仓库中对应课件发布路径，如：'/LocalGitLab/courseware/dist/static/courseware/ShuZiMi'
4. 点击'构建发布'，关注编辑器控制台日志是否有报错，当弹出 '请到Jenkins点击构建' 对话框即代表工作完成
5. 检查courseware仓库是否有信息为'CC plugin auto_deploy commit automatically.'的提交记录
6. 手动完成Jenkins构建操作

### 已知问题
1. 当本次提交没有内容变化时控制台会有报错信息，本次提交失败
2. 暂时不支持自动触发Jenkins构建