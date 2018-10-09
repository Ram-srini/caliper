cd ./simple
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config.json -n fabric.json
/opt/intel/storage-snapshot/sps-stop.sh
sleep 20
cd ./smallbank
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config.json -n fabric.json
/opt/intel/storage-snapshot/sps-stop.sh
sleep 20
cd ./simple
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config_longrun.json -n fabric.json
/opt/intel/storage-snapshot/sps-stop.sh
cd ./smallbank
sleep 20
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config_longrun.json -n fabric.json
/opt/intel/storage-snapshot/sps-stop.sh
