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
    echo "[ COURSEWARE_PATH: ] "$coursewarePath

    # write path to file 
    echo $coursewarePath > config.txt
else
    echo "[ COURSEWARE_PATH: ] "$coursewarePath
fi

echo "******************  update courseware ******************"
printf "\n"
cd $coursewarePath
git pull
echo "git pull finished ..."
printf "\n"

read -p "Please input Game Name > " gameName 
printf "\n"
echo "[ PROJECT NAME: ] "$gameName
printf "\n"

mkdir originFiles/$gameName

# copy floders
cp -rf $coursewarePath/dist/static/courseware/$gameName originFiles/$gameName &&
cp -rf IpadFiles/courseware-v1.0.0-alpha.js originFiles/$gameName/$gameName/student &&
cp -rf IpadFiles/ipadIndex.html originFiles/$gameName/$gameName/student &&
cp -rf IpadFiles/webview-bridge.js originFiles/$gameName/$gameName/student && 
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

# copy zip to courseware path 
cp zips/$gameName.zip $coursewarePath/dist/static/gameZip/$gameName.zip
echo "copy zip to coursewareZip finished ... "

# run command git
cd $coursewarePath
git pull
git add /dist/static/gameZip/$gameName.zip
git commit -m "upload "$gameName" zip"
git push
echo "git upload "$gameName".zip finished ... "

printf "\n"
echo "ALL IS DONE !!!"