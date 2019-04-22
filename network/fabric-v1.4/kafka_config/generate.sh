#!/usr/bin/env bash

# Prior to generation, need to run:
# export FABRIC_CFG_PATH=<path to directory>

# The below assumes you have the relevant code available to generate the cryto-material
export FABRIC_SAMPLE_BIN=~/fabric-samples-1.4/bin
$FABRIC_SAMPLE_BIN/cryptogen generate --config=./crypto-config.yaml
$FABRIC_SAMPLE_BIN/configtxgen -profile OrgsOrdererGenesis -outputBlock orgs.genesis.block
$FABRIC_SAMPLE_BIN/configtxgen -profile OrgsChannel1 -outputCreateChannelTx mychannel.tx -channelID mychannel
$FABRIC_SAMPLE_BIN/configtxgen -profile OrgsChannel2 -outputCreateChannelTx yourchannel.tx -channelID yourchannel

# Rename the key files we use to be key.pem instead of a uuid
for KEY in $(find crypto-config -type f -name "*_sk"); do
    KEY_DIR=$(dirname ${KEY})
    mv ${KEY} ${KEY_DIR}/key.pem
done
