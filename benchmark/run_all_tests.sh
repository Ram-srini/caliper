cd ./simple
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config.yaml -n fabric.json
/opt/intel/storage-snapshot/sps-stop.sh
sleep 20
cd ./smallbank
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config.yaml -n fabric.json
/opt/intel/storage-snapshot/sps-stop.sh
sleep 20
cd ./simple
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config_longrun.yaml -n fabric.json
/opt/intel/storage-snapshot/sps-stop.sh
cd ./smallbank
sleep 20
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config_longrun.yaml -n fabric.json
/opt/intel/storage-snapshot/sps-stop.sh
