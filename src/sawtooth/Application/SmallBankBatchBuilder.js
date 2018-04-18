'use strict'

var BatchBuilder = require('./BatchBuilder.js')

class SmallBankBatchBuilder extends BatchBuilder {

    constructor(fName, fVersion) {
        super();
        this.familyName = fName;
        this.familyVersion = fVersion;
    }
    calculateAddress(name) {
        //Generate byte array from customer id
        var byteArray = as_bytes(name.toString());
        const crypto = require('crypto');
        const _hash = (x) =>
            crypto.createHash('sha512').update(x).digest('hex');

        //convert the hash bytes to hex sring
        var hexAddress = bytes_to_hex_str(_hash(Buffer.from(byteArray)));

        const familyNameSpace = _hash(this.familyName).substring(0, 6);
        let address = familyNameSpace + hexAddress.substring(0,64);
        console.log('address: '+address);
        return address;
    }

    calculateAddresses(args) {
        var addresses = [];
        for (let key in args) {
            let address = this.calculateAddress(key.toString());
            addresses.push(address);
        }
        return addresses;
    }

    buildBatch(args) {
        const {createHash} = require('crypto');
        const {createContext, CryptoFactory} = require('sawtooth-sdk/signing');
        const context = createContext('secp256k1');
        const {protobuf} = require('sawtooth-sdk');

        const privateKey = context.newRandomPrivateKey();
        const signer = new CryptoFactory(context).newSigner(privateKey);

        //get customer ids from the argument and calculate the addresses from
        //customer ids
        var ids = getCustomerIds(args);
        var in_address = this.calculateAddress(ids[0]);
        var input_address=[in_address];
        var output_address=[in_address];
        if(ids.length === 2) {
            var out_address = this.calculateAddress(ids[1]);
            input_address.push(out_address);
            output_address.push(out_address);
        }
        //Generate protobuf payload from input args 
        const payloadBytes = buildPayload(args);
        
        //Construct transaction header
        const transactionHeaderBytes = protobuf.TransactionHeader.encode({
            familyName: this.familyName,
            familyVersion: this.familyVersion,
            inputs: input_address,
            outputs: output_address,
            signerPublicKey: signer.getPublicKey().asHex(),
            batcherPublicKey: signer.getPublicKey().asHex(),
            dependencies: [],
            payloadSha512: createHash('sha512').update(payloadBytes).digest('hex') 
        }).finish();

        //construct transaction
        const txnSignature = signer.sign(transactionHeaderBytes);
        const transaction = protobuf.Transaction.create({
            header: transactionHeaderBytes,
            headerSignature: txnSignature,
            payload: payloadBytes
        });

        //constrcut batch
        const transactions = [transaction]
        const batchHeaderBytes = protobuf.BatchHeader.encode({
            signerPublicKey: signer.getPublicKey().asHex(),
            transactionIds: transactions.map((txn) => txn.headerSignature),
        }).finish();

        const batchSignature = signer.sign(batchHeaderBytes)
        const batch = protobuf.Batch.create({
            header: batchHeaderBytes,
            headerSignature: batchSignature,
            transactions: transactions
        });

        //construct batch list
        const batchListBytes = protobuf.BatchList.encode({
            batches: [batch]
        }).finish();

        return batchListBytes;
    }
}

module.exports = SmallBankBatchBuilder;

function getCustomerIds(args) {
    var cust_ids = [];
    //Based on the payload type get the customer ids
    switch(args['PayloadType']) {
        case 1: 
                var message = args['CreateAccountTransactionData'];
                cust_ids.push(message['customer_id']);
                break;
        case 2: 
                var message = args['DepositCheckingTransactionData'];
                cust_ids.push(message['customer_id']);
                break;
        case 3: 
                var message = args['WriteCheckTransactionData'];
                cust_ids.push(message['customer_id']);
                break;
        case 4: 
                var message = args['TransactSavingsTransactionData'];
                cust_ids.push(message['customer_id']);
                break;
        case 5: 
                var message = args['SendPaymentTransactionData'];
                cust_ids.push(message['source_customer_id']);
                cust_ids.push(message['dest_customer_id']);
                break;
        case 6: 
                var message = args['AmalgamateTransactionData'];
                cust_ids.push(message['source_customer_id']);
                cust_ids.push(message['dest_customer_id']);
                break;
        default:
                console.log("Error: Unknown payload type" + args['payload_type']); 
                break;
        }
    console.log(cust_ids);
        return cust_ids;
}

function buildPayload(args) {
    var payloadBytes;
    //Based on the payload type construct the protobuf message
    switch(args['PayloadType']) {
        case 1:
            payloadBytes = createAccountPayload(args['CreateAccountTransactionData']);
            break;
        case 2:
            payloadBytes = createDepositCheckingPayload(args['DepositCheckingTransactionData']);
            break;
        case 3:
            payloadBytes = createWriteCheckPayload(args['WriteCheckTransactionData']);
            break;
        case 4:
            payloadBytes = createTransactSavingsPayload(args['TransactSavingsTransactionData']);
            break;
        case 5:
            payloadBytes = createSendPaymentPayload(args['SendPaymentTransactionData']);
            break;
        case 6:
            payloadBytes = createAmalgamatePayload(args['AmalgamateTransactionData']);
            break;
    }
    return payloadBytes;
}

function createAccountPayload(args) {
    var protobuf = require('protocol-buffers');
    var fs = require('fs');
    var root = protobuf(fs.readFileSync('./protos/smallbank.proto'));

    var account = root.SmallbankTransactionPayload.encode({
        payload_type: root.SmallbankTransactionPayload.PayloadType.CREATE_ACCOUNT,
        create_account: {
           customer_id: args['customer_id'],
           customer_name: args['customer_name'],
           initial_savings_balance: args['initial_savings_balance'],
           initial_checking_balance: args['initial_checking_balance']
           }
        });
    return account;
}

function createDepositCheckingPayload(args) {
    var protobuf = require('protocol-buffers');
    var fs = require('fs');
    var root = protobuf(fs.readFileSync('./protos/smallbank.proto'));

    var account = root.SmallbankTransactionPayload.encode({
        payload_type: root.SmallbankTransactionPayload.PayloadType.DEPOSIT_CHECKING,
        deposit_checking: {
           customer_id: args['customer_id'],
           amount: args['amount']
           }
        });
    return account;
}

function createWriteCheckPayload(args) {
    var protobuf = require('protocol-buffers');
    var fs = require('fs');
    var root = protobuf(fs.readFileSync('./protos/smallbank.proto'));

    var account = root.SmallbankTransactionPayload.encode({
        payload_type: root.SmallbankTransactionPayload.PayloadType.WRITE_CHECK,
        write_check: {
           customer_id: args['customer_id'],
           amount: args['amount']
           }
        });
    return account;
}

function createTransactSavingsPayload(args) {
    var protobuf = require('protocol-buffers');
    var fs = require('fs');
    var root = protobuf(fs.readFileSync('./protos/smallbank.proto'));

    var account = root.SmallbankTransactionPayload.encode({
        payload_type: root.SmallbankTransactionPayload.PayloadType.TRANSACT_SAVINGS,
        transact_savings: {
           customer_id: args['customer_id'],
           amount: args['amount']
           }
        });
    return account;
}

function createSendPaymentPayload(args) {
    var protobuf = require('protocol-buffers');
    var fs = require('fs');
    var root = protobuf(fs.readFileSync('./protos/smallbank.proto'));

    var sendPayment = root.SmallbankTransactionPayload.encode({
        payload_type: root.SmallbankTransactionPayload.PayloadType.SEND_PAYMENT,
        send_payment: {
           source_customer_id: args['source_customer_id'],
           dest_customer_id: args['dest_customer_id'],
           amount: args['amount']
           }
        });
    return sendPayment;
}

function createAmalgamatePayload(args) {
    var protobuf = require('protocol-buffers');
    var fs = require('fs');
    var root = protobuf(fs.readFileSync('./protos/smallbank.proto'));

    var amalgamatePayment = root.SmallbankTransactionPayload.encode({
        payload_type: root.SmallbankTransactionPayload.PayloadType.AMALGAMATE,
        amalgamate: {
           source_customer_id: args['source_customer_id'],
           dest_customer_id: args['dest_customer_id'],
           }
        });
    return amalgamatePayment;
}

function as_bytes(str) {
    var byteArray = [];
    for(var i = 0; i<str.length; ++i) {
        var y = str.charCodeAt(i);
        byteArray = byteArray.concat([y]);
    }
    return byteArray;
}

function bytes_to_hex_str(buffer) {
    var hexStringArray = [];
    for(var i = 0; i<buffer.length; ++i) {
       hexStringArray = hexStringArray.concat([buffer[i].toString(16)])
    }
    var hexAddress = hexStringArray.join('').toString();
    return hexAddress;
}
