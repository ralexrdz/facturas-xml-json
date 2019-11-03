let AWS = require('aws-sdk')
const xml2js = require('xml2js');
const mongoose = require('mongoose');

var url = "mongodb://localhost:27017/ordux";

mongoose.connect(url, {useNewUrlParser: true})
const CfdiSchema = { 
  key: {
    type:String,
    unique: true
  },
  json: Object,
  version: String,
  serie: String,
  folio: String,
  fecha: String,
  subTotal: String,
  tipoCambio: String,
  moneda: String,
  total: String,
  descuento: String,
  tipoDeComprobante: String,
  metodoDePago: String,
  formaPago: String,
  lugarExpedicion: String,
  uuid: String,
  nombreEmisor: String,
  rfcEmisor: String,
  nombreReceptor: String,
  rfcReceptor: String,
}
const Cfdi = mongoose.model('cfdi', CfdiSchema );

Cfdi.findOne({}).sort({$natural: -1}).exec(function(err,doc){
  console.log(doc)
});