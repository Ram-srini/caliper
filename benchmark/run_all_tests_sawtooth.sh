cd /home/builder/caliper/benchmark/simple
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config-sawtooth.json -n sawtooth.json
/opt/intel/storage-snapshot/sps-stop.sh
sleep 20
#/opt/intel/storage-snapshot/sps-start.sh
#node main.js -c config_longrun-sawtooth.json -n sawtooth.json
#/opt/intel/storage-snapshot/sps-stop.sh
cd /home/builder/caliper/benchmark/smallbank
#sleep 20
/opt/intel/storage-snapshot/sps-start.sh
node main.js -c config-smallbank-sawtooth.json -n sawtooth.json
/opt/intel/storage-snapshot/sps-stop.sh
#sleep 20
#/opt/intel/storage-snapshot/sps-start.sh
#node main.js -c config_longrun-sawtooth.json -n sawtooth.json
#/opt/intel/storage-snapshot/sps-stop.sh
