var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/caracal-db');
// create instance of Schema for caracal application note that this run on 27017 "smi.ketabi"
var mongoSchema =   mongoose.Schema;
// create schema
var transactionSchema  = {
    "transactionId" : String,
    "tagName" : String
};
// create model if not exists.
module.exports = mongoose.model('tr-tags',transactionSchema);