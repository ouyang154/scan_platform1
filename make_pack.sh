#!/bin/bash
set -ex

#CNPM="npm --registry=https://registry.npm.taobao.org \
#--cache=$HOME/.npm/.cache/cnpm \
#--disturl=https://npm.taobao.org/dist \
#--userconfig=$HOME/.cnpmrc"

VERSION=2.0
REVISION=$(date +%Y%m%d%H%M)
EXT=deb

WORKINGPATH=$(pwd)
SCRIPTPATH="$( cd "$(dirname "$0")" ; pwd -P )"

PACKAGE_ROOT=/tmp/cytovue_package
rm -rf $PACKAGE_ROOT $SCRIPTPATH/*.deb
mkdir -p $PACKAGE_ROOT/var/www

cp -r $SCRIPTPATH $PACKAGE_ROOT/var/www/vue-cytowise
pushd $PACKAGE_ROOT/var/www/vue-cytowise

rm -rf .git* README make_pack.sh obselete public/static/exam public/static/media &

cnpm install
npm run build &

mv -v	./debian		$PACKAGE_ROOT/DEBIAN
mv -v	./etc			$PACKAGE_ROOT/etc/
wait

# remove everything except dist folder
#rm -rf src obselete server #static 
ls -1 | grep -v dist | xargs -I @ rm -rf @ 

popd

dpkg -b $PACKAGE_ROOT $WORKINGPATH/cytovue-$VERSION-$REVISION.$EXT

