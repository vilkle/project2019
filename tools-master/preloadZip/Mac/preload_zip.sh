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
    # echo $path
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

printf "\n"
read -p "Please input Game Name > " gameName 
echo "gameName is : " $gameName
echo "coursewarePath is : " $coursewarePath
printf "\n"

# copy floders
cp -rf $coursewarePath/dist/static/courseware/$gameName originFiles/ &&
cp -rf IpadFiles/courseware-v1.0.0-alpha.js originFiles/$gameName/student &&
cp -rf IpadFiles/ipadIndex.html originFiles/$gameName/student &&
cp -rf IpadFiles/webview-bridge.js originFiles/$gameName/student && 
rm -rf originFiles/$gameName/teacher &&
echo "copy student && sdk finished ... "
echo "..."

# enter inside floder env
cd $curPath/originFiles/
zip -q -r $gameName.zip $gameName &&
echo "zip finished ... "

cd $curPath
# copy zip to zips
mv originFiles/$gameName.zip zips &&
echo "move zip to zips finished ... "

# copy zip to courseware path 
cp zips/$gameName.zip $coursewarePath/dist/static/coursewareZip/mobile/$gameName.zip
echo "copy zip to coursewareZip finished ... "

# run command git
cd $coursewarePath
git pull
git add dist/static/coursewareZip/mobile/$gameName.zip
git commit -m "upload "$gameName" zip"
git push
echo "git upload finished ... "

printf "\n"
echo "ALL IS DONE !!!"