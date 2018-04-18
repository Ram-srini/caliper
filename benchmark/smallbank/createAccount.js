/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
*/

'use strict'

module.exports.info  = "small_bank_operations";

var bc, contx;
var accounts = [];
var initialBalance=1000000

module.exports.init = function(blockchain, context, args) {
    bc = blockchain;
    contx = context;

    return Promise.resolve();
}

module.exports.run = function() {
    const args = createAccountPayload()
    return bc.invokeSmartContract(contx, 'smallbank', '1.0', args, 30);
}

module.exports.end = function(results) {
    return Promise.resolve();
}

function createAccountPayload() {
    var payload = {
        PayloadType:1,
        CreateAccountTransactionData: {
            customer_id: getNextAccount(),
            customer_name: "Ramkumar",
            initial_savings_balance: initialBalance,
            initial_checking_balance: initialBalance
        }
    };
    return payload;
}

function getNextAccount() {
    var length = accounts.length;
    length = length + 1;
    accounts.push(length);
    return length;
}

module.exports.accounts = accounts;
