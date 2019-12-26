# preloadZips

预加载zip包打包脚本（多项目自动打包、不上传git）

---

### 使用方法
1. 下载本文件夹在本地任意目录，双击执行preload_zips_new.bat文件  
2. 每次使用之前需要维护本工程内`games.txt`，将要打包的项目名称写入本文件，***注意： 每行 只能 输入一个项目名称***
3. 首次使用，按照提示一次输入本地courseware目录（**注意：到courseware根目录即可，形如：D:\TAL\courseware**），之后不需要再次输入目录  
4. 此脚本不会自动上传git，打出的zip包在`zips`目录下