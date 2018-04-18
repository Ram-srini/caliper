/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
*/

'use strict'

module.exports.info  = "small_bank_operations";

var bc, contx;
var no_accounts;
var transfer_amount=20;

module.exports.init = function(blockchain, context, args) {
    const acc = require('./createAccount.js')
    no_accounts = acc.accounts.length;
    bc = blockchain;
    contx = context;

    return Promise.resolve();
}

module.exports.run = function() {
    const args = createSendPayemntPayload()
    return bc.invokeSmartContract(contx, 'smallbank', '1.0', args, 30);
}

module.exports.end = function(results) {
    return Promise.resolve();
}

function createSendPayemntPayload() {
    var min=0, max=no_accounts;
    var src_id = Math.floor(Math.random() * (max - min) + min);
    var dst_id = Math.floor(Math.random() * (max - min) + min);
    var payload = {
        PayloadType:5,
        SendPaymentTransactionData: {
            source_customer_id: src_id,
            dest_customer_id: dst_id,
            amount: transfer_amount
        }
    };
    return payload;
}

