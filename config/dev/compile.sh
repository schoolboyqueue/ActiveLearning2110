rm -rf js css
mkdir -p js css
echo "Downloading JS Dependencies"
wget -P js -i js.txt >/dev/null 2>&1
echo "Downloading CSS Dependencies"
wget -P css -i css.txt >/dev/null 2>&1
echo "Compressing JS Files"
IFS=$'\n' read -d '' -r -a js_files < js.txt
for ((i=0; i < ${#js_files[@]}; i++));
do
    js_files[$i]="js/${js_files[i]##*/}"
done
uglifyjs ${js_files[@]} --output default.js --compress dead_code,conditionals,comparisons,booleans,loops  >/dev/null 2>&1
echo "Compressing CSS Files"
IFS=$'\n' read -d '' -r -a css_files < css.txt
for ((i=0; i < ${#css_files[@]}; i++));
do
    css_files[$i]="js/${css_files[i]##*/}"
done
uglifycss css/*.css > default.css
echo "Moving Files"
mv default.css ../../app_client/app-css
mv default.js ../../app_client/app-scripts
echo "Cleaning Up"
rm -rf js css
echo "Done."
