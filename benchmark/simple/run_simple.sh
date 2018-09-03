cd /home/builder/fabric/caliper/benchmark/simple
node main.js -c config_longrun.json -n fabric.json
sleep 10
node main.js -c config.json -n fabric.json
ps -ef |grep dstat |grep -v grep | cut -d ' ' -f 3 |xargs kill -9

