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
const Fallidos = mongoose.model('fallidos', {key: String} );

let parser = new xml2js.Parser()
// AWS.config.update({region: 'US East (N. Virginia)'});
var s3 = new AWS.S3()

var bucketParams = {
  Bucket : 'sicoe-xmls-test'
};

const lee1000Archivos = () => {
  Cfdi.findOne({}).sort({$natural: -1}).exec(function(err,ultimo){
    console.log('ultimo',ultimo)
    
    if (ultimo) {
      bucketParams.Marker = ultimo.key
    } else {
      console.log('no hay ultimo');
    }
    
    // Call S3 to obtain a list of the objects in the bucket
    s3.listObjects(bucketParams, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        data.Contents.forEach(c => {
          leeArchivo(c.Key)
        })
        return data.Contents.length
      }
    });
  });
}



const leeArchivo = (key) => {
  if (key.endsWith('.xml')) {
    console.log(key)
    Cfdi.create({key})
    s3.getObject({Bucket: bucketParams.Bucket, Key: key}, function(err, data) {
      if (err) {
        console.log("Error", err);
      } else {
        xmlToJson(data.Body.toString(), key)
      }
    });
  } else {
    console.log('NO XML', key)
  }
}

const xmlToJson = (xml, key) => {
  parser.parseString(xml, function (err, result) {
    let jsonString = JSON.stringify(result)
    jsonString = jsonString.replace(/\"\$\"/g, '"atr"')
    let comprobante = result['cfdi:Comprobante']

    if (!comprobante) {
      Fallidos.create({key})
    } else {
    
      Cfdi.updateOne({key},{ $set: {
        json: JSON.parse(jsonString),
        version: comprobante.$.version || comprobante.$.Version || '', 
        serie: comprobante.$.serie || comprobante.$.Serie  || '', 
        folio: comprobante.$.folio || comprobante.$.Folio || '', 
        fecha: comprobante.$.fecha || comprobante.$.Fecha || '', 
        subTotal: comprobante.$.subTotal || comprobante.$.SubTotal || '', 
        tipoCambio: comprobante.$.TipoCambio,
        moneda: comprobante.$.Moneda,
        total: comprobante.$.total || comprobante.$.Total || '', 
        descuento: comprobante.$.descuento || comprobante.$.Descuento || '', 
        tipoDeComprobante: comprobante.$.tipoDeComprobante || comprobante.$.TipoDeComprobante  || '', 
        metodoDePago: comprobante.$.MetodoPago || comprobante.$.metodoDePago || '', 
        formaPago: comprobante.$.FormaPago || comprobante.$.formaDePago  || '', 
        lugarExpedicion: comprobante.$.LugarExpedicion,
        uuid: comprobante['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$.UUID,
        rfcReceptor: comprobante['cfdi:Receptor'][0].$.Rfc,
        nombreReceptor: comprobante['cfdi:Receptor'][0].$.Nombre || comprobante['cfdi:Receptor'][0].$.nombre || '',
        rfcEmisor: comprobante['cfdi:Emisor'][0].$.Rfc || comprobante['cfdi:Emisor'][0].$.rfc,
        nombreEmisor: comprobante['cfdi:Emisor'][0].$.Nombre || comprobante['cfdi:Emisor'][0].$.nombre || ''
      }}).then(res => console.log(res))
      .catch(err => console.log(err))
      
    }
    // jsonfile.writeFileSync(`./${a}.json`, result)
    // console.log(`Creando ${a}.json`);
  });

}

module.exports = lee1000Archivos