#!/usr/bin/env bash

# Prior to generation, need to run:
# export FABRIC_CFG_PATH=<path to directory>

# The below assumes you have the relevant code available to generate the cryto-material
~/fabric-samples/bin/cryptogen generate --config=./crypto-config.yaml
~/fabric-samples/bin/configtxgen -profile OrgsOrdererGenesis -outputBlock orgs.genesis.block
~/fabric-samples/bin/configtxgen -profile OrgsChannel1 -outputCreateChannelTx mychannel.tx -channelID mychannel
~/fabric-samples/bin/configtxgen -profile OrgsChannel1 -outputCreateChannelTx mychannel1.tx -channelID mychannel1
~/fabric-samples/bin/configtxgen -profile OrgsChannel2 -outputCreateChannelTx mychannel2.tx -channelID mychannel2
~/fabric-samples/bin/configtxgen -profile OrgsChannel3 -outputCreateChannelTx mychannel3.tx -channelID mychannel3
~/fabric-samples/bin/configtxgen -profile OrgsChannel4 -outputCreateChannelTx mychannel4.tx -channelID mychannel4

# Rename the key files we use to be key.pem instead of a uuid
for KEY in $(find crypto-config -type f -name "*_sk"); do
    KEY_DIR=$(dirname ${KEY})
    mv ${KEY} ${KEY_DIR}/key.pem
done
