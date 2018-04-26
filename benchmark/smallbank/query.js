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
    var acc = require('./smallbankOperations.js');
    bc       = blockchain;
    contx    = context;
    no_accounts = acc.no_accounts;
    return Promise.resolve();
}

module.exports.run = function() {
    var acc_num  = Math.floor(Math.random()*(no_accounts));
    return bc.queryState(contx, 'smallbank', 'v0', acc_num);
}

module.exports.end = function(results) {
    // do nothing
    return Promise.resolve();
}
