/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
*/

'use strict'

module.exports.info  = "querying accounts";


var bc, contx;
var no_accounts;
module.exports.init = function(blockchain, context, args) {
    var acc = require('./createAccount.js');
    bc       = blockchain;
    contx    = context;
    no_accounts = acc.accounts;
    return Promise.resolve();
}

module.exports.run = function() {
    var acc  = no_accounts[Math.floor(Math.random()*(no_accounts.length))];

    return bc.queryState(contx, 'smallbank', 'v0', acc);
}

module.exports.end = function(results) {
    // do nothing
    return Promise.resolve();
}
