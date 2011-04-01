cat opener.js \
util.js \
blood.js \
carnage.js \
weapons/google.js \
weapons/lightsaber.js \
weapons/bing.js \
weapons/yahoo.js \
weapons/chainsaw.js \
weapons/jcal.js \
mrcutty.js \
closer.js \
> tmp.js

java -jar yuicompressor-2.4.2.jar tmp.js > mrcutty.js
rm tmp.js