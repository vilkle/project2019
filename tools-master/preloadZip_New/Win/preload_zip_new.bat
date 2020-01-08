@echo off
set PARAM=%1

echo ****************** preload zip ******************
echo.

REM get cur floder
set dirName=%cd%
echo [cur path is : ] %dirName%
echo.

REM delete pre copy files
RD /S /Q originFiles
RD /S /Q zips

md zips
md originFiles

set /p coursewarePath=<config.txt
echo coursewarePath is : %coursewarePath%

if defined coursewarePath (
    echo coursewarePath is defined ...
    echo.
    goto CopyFloders
) else (
    echo coursewarePath is null ...
    echo.
    goto GetCoursewarePath
)

pause
exit


:GetCoursewarePath
echo ******************  GetCoursewarePath ******************
echo.
set /p coursewarePath=Please input ur local courseware path :
if defined coursewarePath (
    echo %coursewarePath%>config.txt
    echo [COURSEWARE PATH: ] %coursewarePath%
    echo.
    goto CopyFloders
) else (
    echo get coursewarePath failed ....
    echo.
)
pause
exit

:CopyFloders
echo ******************  CopyFloders and ZipFloders ******************
echo.
echo ******************  update courseware ******************
echo.
PUSHD %coursewarePath%
start /w git pull
echo git pull finished ...
echo.

PUSHD %dirName%
echo ******************  get project name ******************
set /p projectName=Please input ur project name in English :

echo [PROJECT NAME: ] %projectName%
echo.

REM create project floder
md originFiles\%projectName%\%projectName%
echo floders create finish.... ******************
echo.

echo ****************** first copy files ******************
REM copy floders to local temp floder
xcopy /y /e %coursewarePath%\dist\static\courseware\%projectName% originFiles\%projectName%\%projectName%
xcopy /y /e IpadFiles\courseware-v1.0.0-alpha.js originFiles\%projectName%\%projectName%\student
xcopy /y /e IpadFiles\ipadIndex.html originFiles\%projectName%\%projectName%\student
xcopy /y /e IpadFiles\webview-bridge.js originFiles\%projectName%\%projectName%\student
echo first floders copy finish.... ******************
echo.

echo ****************** second copy files ******************
md originFiles\%projectName%\%projectName%\%projectName%\%projectName%\student
REM copy floders to local temp floder
xcopy /y /e originFiles\%projectName%\%projectName%\student originFiles\%projectName%\%projectName%\%projectName%\%projectName%\student
echo first floders copy finish.... ******************
echo.

echo ******************  run inside zip_tools.exe ******************
start /w zip_tool.exe originFiles\%projectName%\%projectName%\%projectName% originFiles\%projectName%\%projectName%.zip
echo inside zip files is ok .... ******************
echo.

REM del first origin files
RD /S /Q originFiles\%projectName%\%projectName%\%projectName%

echo ******************  run outside zip_tools.exe ******************
start /w zip_tool.exe originFiles\%projectName% zips\%projectName%.zip
echo outside zip files is ok .... ******************
echo.

echo ******************  move zip files ******************
echo.
xcopy /y /e zips\%projectName%.zip %coursewarePath%\dist\static\gameZip
echo copy zip files finished ...
echo.

echo ******************  upload zip files to git ******************
echo.
PUSHD %coursewarePath%
start /w git pull
start /w git add %coursewarePath%\dist\static\gameZip\%projectName%.zip
start /w git commit -m "upload %projectName% zip"
start /w git push
echo git upload %projectName%.zip finished ...
echo.

echo ALL IS FINISHED...

pause
exit
