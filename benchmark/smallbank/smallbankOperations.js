/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
*/

'use strict'

module.exports.info  = "small_bank_operations";

var bc, contx;
var seed=0;
var accounts, operations, maxBatchSize;
var initial_balance = 1000000;
var operation_type = ["transact_savings","deposit_checking","send_payment","write_check","amalgamate"];

module.exports.init = function(blockchain, context, args) {
    if(!args.hasOwnProperty('accounts')) {
        return Promise.reject(new Error("smallbank.operations - 'accounts' is missed in the arguments"));
    }
    if(!args.hasOwnProperty('operations')) {
        return Promise.reject(new Error("smallbank.operations - 'operations' is missed in the arguments"));
    }
    if(!args.hasOwnProperty('maxBatchSize')) {
        return Promise.reject(new Error("smallbank.operations - 'maxBatchSize' is missed in the arguments"));
    }
    accounts = args['accounts'];
    operations = args['operations'];
    maxBatchSize = args['maxBatchSize'];
    bc = blockchain;
    contx = context;
    return Promise.resolve();
}

module.exports.run = function() {
    var args = generateWorkload();
    return bc.invokeSmartContract(contx, 'smallbank', '1.0', args, 30);
}

module.exports.end = function(results) {
    return Promise.resolve();
}

function generateWorkload() {
    var workload = [];
    for(var i = 0; i<accounts; i++) {
        var acc = {
            "customer_id": seed,
            "customer_name": random_string(),
            "initial_checking_balance": initial_balance,
            "initial_savings_balance": initial_balance,
            "transaction_type": "create_account"
        };
        console.log('account: '+acc);
        seed++;
        workload.push(acc);
    }
    for(var j= accounts; j<operations; j++) {
        var index =  Math.floor(Math.random() * Math.floor(operation_type.length));
        console.log('index '+ index);
        var random_op = operation_type[index];
        var op_payload;
        switch(random_op) {
            case "transact_savings":
                op_payload = {
                    "amount": Math.floor(Math.random() * 200),
                    "customer_id": Math.floor(Math.random() * seed),
                    "transaction_type":random_op
                };
                break;
            case "deposit_checking":
                op_payload = {
                    "amount": Math.floor(Math.random() * 200),
                    "customer_id": Math.floor(Math.random() * seed),
                    "transaction_type":random_op
                };
                break;
            case "send_payment":
                var dest_customer_id = Math.floor(Math.random() * seed);
                var source_customer_id = Math.floor(Math.random() * seed);
                if(dest_customer_id === source_customer_id) {
                    source_customer_id = Math.floor(Math.random() * seed);
                }
                op_payload = {
                    "amount": Math.floor(Math.random() * 200),
                    "dest_customer_id": dest_customer_id,
                    "source_customer_id": source_customer_id,
                    "transaction_type": random_op                    
                };
                break;
            case "write_check":
                op_payload = {
                    "amount": Math.floor(Math.random() * 200),
                    "customer_id": Math.floor(Math.random() * seed),
                    "transaction_type":random_op
                };
                break;
            case "amalgamate":
                var dest_customer_id = Math.floor(Math.random() * seed);
                var source_customer_id = Math.floor(Math.random() * seed);
                if(dest_customer_id === source_customer_id) {
                    source_customer_id = Math.floor(Math.random() * seed);
                }
                op_payload = {
                    "amount": Math.floor(Math.random() * 200),
                    "dest_customer_id": dest_customer_id,
                    "source_customer_id": source_customer_id,
                    "transaction_type": random_op                    
                };
                break;
            default:
                console.log("Invalid operation!!!");
        }
        console.log('op_payload: ' + op_payload);
        workload.push(op_payload);
    }
    console.log(workload);
    return workload;
}

function random_string() {
    var text = "";
    var possible = "ABCDEFGHIJKL MNOPQRSTUVWXYZ abcdefghij klmnopqrstuvwxyz";

    for (var i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

module.exports.accounts = accounts;
