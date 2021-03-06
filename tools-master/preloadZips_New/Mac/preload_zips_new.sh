#!/bin/bash
echo "*************** preload zip *******************"
echo "..."

rm -rf originFiles
rm -rf zips

mkdir originFiles
mkdir zips
echo "create floder success..."

curPath=$(pwd)
coursewarePath=""
for path in `cat config.txt`
do 
    coursewarePath=$path
done

if [ "$coursewarePath" == "" ] || [-z "$coursewarePath"]
then
    echo "coursewarePath is null ...... "
    read -p "Please input your courseware path > " coursewarePath

    # write path to file 
    echo $coursewarePath > config.txt
else
    echo "coursewarePath is "$coursewarePath 
fi

for gameName in `cat games.txt`
do
    printf "\n"
    echo "PROJECT NAME [" $gameName "]"
    
    mkdir originFiles/$gameName

    # copy floders
    cp -rf $coursewarePath/dist/static/courseware/$gameName originFiles/$gameName &&
    # cp -rf IpadFiles/courseware-v1.0.0-alpha.js originFiles/$gameName/$gameName/student &&
    # cp -rf IpadFiles/ipadIndex.html originFiles/$gameName/$gameName/student &&
    # cp -rf IpadFiles/webview-bridge.js originFiles/$gameName/$gameName/student && 
    rm -rf originFiles/$gameName/$gameName/teacher &&
    echo "copy student && sdk finished ... "
    echo "..."

    # enter inside floder env
    cd $curPath/originFiles/$gameName/
    zip -q -r $gameName.zip $gameName &&
    echo "inside zip finished ... "

    cd $curPath
    # copy teacher floder
    cp -rf $coursewarePath/dist/static/courseware/$gameName/teacher originFiles/$gameName/$gameName &&
    echo "copy teacher floder finished ... "
    echo "..."

    # enter outside floder env
    cd $curPath/originFiles/$gameName
    zip -q -r temp.zip $gameName $gameName.zip &&
    echo "outside zip finished ... "

    cd $curPath
    # move zip to zips
    mv originFiles/$gameName/temp.zip zips/$gameName.zip &&
    echo "move zip finished ... "
done

printf "\n"
echo "ALL IS DONE !!!"