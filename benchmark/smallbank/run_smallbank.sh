cd ~/caliper/benchmark/smallbank
echo "Running smalbank long run tests fabric 1.1 network with 2 orgs and 4 peers.."
node main.js -c config_longrun.yaml -n fabric.json
sleep 10
echo "Running smalbank linear run tests fabric 1.1 network with 2 orgs and 4 peers.."
node main.js -c config.yaml -n fabric.json
