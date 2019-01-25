cd ~/caliper/benchmark/simple
echo "Runing long run tests on 2orgs 4 peers network..."
node main.js -c config_longrun.yaml -n fabric.json
sleep 10
echo "Runing linear run tests on 2orgs 4 peers network..."
node main.js -c config.yaml -n fabric.json

