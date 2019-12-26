@echo off
set PARAM=%1

echo ****************** preload zip ******************
echo ...

rem delete pre copy files
RD /S /Q mobile
RD /S /Q pc
RD /S /Q zips

md mobile
md pc
md zips\mobile
md zips\pc

set /p coursewarePath=<config.txt
echo coursewarePath is : %coursewarePath%

if defined coursewarePath (
    echo coursewarePath is defined !!!!!!!!!!!
    echo ...
    goto MoveFloders
) else (
    echo coursewarePath is null !!!!!!!!!!
    goto GetCoursewarePath
)

pause
exit


:GetCoursewarePath
echo ******************  GetCoursewarePath ******************
set /p coursewarePath=Please input ur local courseware path :
if defined coursewarePath (
    echo %coursewarePath%>config.txt
    goto MoveFloders
) else (
    echo get coursewarePath failed ....
)
pause
exit

:MoveFloders
echo ******************  MoveFloders and ZipFloders ******************
for /f  %%a in (games.txt) do (
    echo %%a

    rem create project floder
    md mobile\%%a\%%a
    md pc\%%a\%%a
    echo floders create finish.... ******************
    echo ...

    echo ******************  copy files ******************
    rem copy floders to local temp floder
    xcopy /y /e %coursewarePath%\dist\static\courseware\%%a pc\%%a\%%a
    xcopy /y /e %coursewarePath%\dist\static\courseware\%%a mobile\%%a\%%a
    RD /S /Q pc\%%a\%%a\teacher
    RD /S /Q mobile\%%a\%%a\teacher
    xcopy /y /e IpadFiles\courseware-v1.0.0-alpha.js mobile\%%a\%%a\student
    xcopy /y /e IpadFiles\ipadIndex.html mobile\%%a\%%a\student
    xcopy /y /e IpadFiles\webview-bridge.js mobile\%%a\%%a\student
    echo floders copy finish.... ******************
    echo ...

    echo ******************  run zip_tools.exe ******************
    start /w zip_tool.exe pc\%%a zips\pc\%%a.zip
    start /w zip_tool.exe mobile\%%a zips\mobile\%%a.zip
    echo zip files is ok .... ******************
    echo ...
    echo ALL IS FINISHED...
)
pause
exit
