@echo off
set PARAM=%1

echo ****************** preload zip ******************
echo ...

rem delete pre copy files
RD /S /Q originFiles
RD /S /Q zips

md zips
md originFiles

set /p coursewarePath=<config.txt
echo coursewarePath is : %coursewarePath%

if defined coursewarePath (
    echo coursewarePath is defined !!!!!!!!!!!
    echo ...
    goto CopyFloders
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
    goto CopyFloders
) else (
    echo get coursewarePath failed ....
)
pause
exit

:CopyFloders
echo ******************  CopyFloders and ZipFloders ******************
for /f  %%a in (games.txt) do (
    echo %%a

    rem create project floder
    md originFiles\%%a\%%a
    echo floders create finish.... ******************
    echo ...

    echo ****************** first copy files ******************
    rem copy floders to local temp floder
    xcopy /y /e %coursewarePath%\dist\static\courseware\%%a originFiles\%%a\%%a
    xcopy /y /e IpadFiles\courseware-v1.0.0-alpha.js originFiles\%%a\%%a\student
    xcopy /y /e IpadFiles\ipadIndex.html originFiles\%%a\%%a\student
    xcopy /y /e IpadFiles\webview-bridge.js originFiles\%%a\%%a\student
    echo first floders copy finish.... ******************
    echo ...

    echo ****************** second copy files ******************
    md originFiles\%%a\%%a\%%a\%%a\student
    rem copy floders to local temp floder
    xcopy /y /e originFiles\%%a\%%a\student originFiles\%%a\%%a\%%a\%%a\student
    echo first floders copy finish.... ******************
    echo ...

    echo ******************  run first zip_tools.exe ******************
    start /w zip_tool.exe originFiles\%%a\%%a\%%a originFiles\%%a\%%a.zip
    echo second zip files is ok .... ******************
    echo ...

    rem del first origin files
    RD /S /Q originFiles\%%a\%%a\%%a

    echo ******************  run second zip_tools.exe ******************
    start /w zip_tool.exe originFiles\%%a zips\%%a.zip
    echo second zip files is ok .... ******************
    echo ...

    echo ALL IS FINISHED...
)
pause
exit
