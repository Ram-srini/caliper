/**
* Copyright 2017 HUAWEI. All Rights Reserved.
*
* SPDX-License-Identifier: Apache-2.0
*
*/

'use strict'

module.exports.info  = "small_bank_operations";

var bc, contx;
var no_accounts=0;
var accounts, txnPerBatch;
var initial_balance = 1000000;
var operation_type = ["transact_savings","deposit_checking","send_payment","write_check","amalgamate"];

module.exports.init = function(blockchain, context, args) {
    if(!args.hasOwnProperty('accounts')) {
        return Promise.reject(new Error("smallbank.operations - 'accounts' is missed in the arguments"));
    }
    if(!args.hasOwnProperty('txnPerBatch')) {
        return Promise.reject(new Error("smallbank.operations - 'txnPerBatch' is missed in the arguments"));
    }
    accounts = args['accounts'];
    if(accounts <=3) {
        return Promise.reject(new Error("smallbank.operations - number accounts should be more than 3"));
    }
    txnPerBatch = args['txnPerBatch'];
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
    for(var i= 0; (i < txnPerBatch && no_accounts<accounts); i++,no_accounts++) {
        var acc = {
            "customer_id": no_accounts,
            "customer_name": random_string(),
            "initial_checking_balance": initial_balance,
            "initial_savings_balance": initial_balance,
            "transaction_type": "create_account"
        };
        workload.push(acc);
    }
    if(workload.length === txnPerBatch) {
        return workload;
    }
    else {
        for(var j= workload.length; j<txnPerBatch; j++) {
            var index =  Math.floor(Math.random() * Math.floor(operation_type.length));
            var random_op = operation_type[index];
            var op_payload;
            switch(random_op) {
                case "transact_savings":
                    op_payload = {
                        "amount": Math.floor(Math.random() * 200),
                        "customer_id": Math.floor(Math.random() * no_accounts),
                        "transaction_type":random_op
                    };
                    break;
                case "deposit_checking":
                    op_payload = {
                        "amount": Math.floor(Math.random() * 200),
                        "customer_id": Math.floor(Math.random() * no_accounts),
                        "transaction_type":random_op
                    };
                    break;
                case "send_payment":
                    var dest_customer_id = Math.floor(Math.random() * no_accounts);
                    var source_customer_id = Math.floor(Math.random() * no_accounts);
                    if(dest_customer_id === source_customer_id) {
                        source_customer_id = Math.floor(Math.random() * no_accounts);
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
                        "customer_id": Math.floor(Math.random() * no_accounts),
                        "transaction_type":random_op
                    };
                    break;
                case "amalgamate":
                    var dest_customer_id = Math.floor(Math.random() * no_accounts);
                    var source_customer_id = Math.floor(Math.random() * no_accounts);
                    if(dest_customer_id === source_customer_id) {
                        source_customer_id = Math.floor(Math.random() * no_accounts);
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
            workload.push(op_payload);
        }
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

module.exports.no_accounts = no_accounts;
