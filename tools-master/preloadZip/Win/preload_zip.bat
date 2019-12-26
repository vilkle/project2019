@echo off
set PARAM=%1

echo ****************** preload zip ******************
echo ...

rem get cur floder
set dirName=%cd%
echo cur path is : %dirName%

set /p coursewarePath=<config.txt
echo coursewarePath is : %coursewarePath%

if defined coursewarePath (
    goto AfterOptions
) else (
    goto GetCoursewarePath
)
pause
exit

:GetCoursewarePath
echo ...
echo ******************  get courseware path ******************
set /p coursewarePath=Please input ur local courseware path :
if defined coursewarePath (
    echo %coursewarePath%>config.txt
    goto AfterOptions
) else (
    echo get coursewarePath failed ....
)
pause
exit

:AfterOptions
echo ******************  update courseware ******************
PUSHD %coursewarePath%
start /w git pull
echo git pull finished ...

echo ******************  get project name ******************
set /p projectName=Please input ur project name in English :

PUSHD %dirName%
rem create project floder
md mobile\%projectName%\%projectName%
md pc\%projectName%\%projectName%
md zips\mobile
md zips\pc
echo floders create finish.... ******************
echo ...

echo ******************  copy files ******************
rem copy floders to local temp floder
xcopy /y /e %coursewarePath%\dist\static\courseware\%projectName% pc\%projectName%\%projectName%
xcopy /y /e %coursewarePath%\dist\static\courseware\%projectName% mobile\%projectName%\%projectName%
RD /S /Q pc\%projectName%\%projectName%\teacher
RD /S /Q mobile\%projectName%\%projectName%\teacher
xcopy /y /e IpadFiles\courseware-v1.0.0-alpha.js mobile\%projectName%\%projectName%\student
xcopy /y /e IpadFiles\ipadIndex.html mobile\%projectName%\%projectName%\student
xcopy /y /e IpadFiles\webview-bridge.js mobile\%projectName%\%projectName%\student
echo floders copy finish.... ******************
echo ...

echo ******************  run zip_tools.exe ******************
start /w zip_tool.exe pc\%projectName% zips\pc\%projectName%.zip
start /w zip_tool.exe mobile\%projectName% zips\mobile\%projectName%.zip
echo zip files is ok .... ******************
echo ...

rem delete pre copy files
RD /S /Q mobile\%projectName%
RD /S /Q pc\%projectName%

echo ******************  move zip files ******************
xcopy /y /e zips\mobile\%projectName%.zip %coursewarePath%\dist\static\coursewareZip\mobile
xcopy /y /e zips\pc\%projectName%.zip %coursewarePath%\dist\static\coursewareZip\pc
echo copy zip files finished ...
echo ...

echo ******************  upload zip files to git ******************
PUSHD %coursewarePath%
start /w git pull
start /w git add .
start /w git commit -m "upload %projectName% zip"
start /w git push
echo git upload finished ...
echo ALL IS FINISHED...

pause
exit
