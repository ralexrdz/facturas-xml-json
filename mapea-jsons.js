let jsonfile = require('jsonfile')

let fs = require('fs')

const creaHTML = (mapaJsons) => {
  console.log('/compilado.html')
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>Document</title>
    </head>
    <body>
      ${mapaJsons.map(m => {
        return `
        <details>
          <summary>${m.UUID}</summary>
          <ul>
            <li>version: ${m.version}</li>
            <li>serie: ${m.serie}</li>
            <li>folio: ${m.folio}</li>
            <li>fecha: ${m.fecha}</li>
            <li>subTotal: ${m.subTotal}</li>
            <li>TipoCambio: ${m.TipoCambio}</li>
            <li>Moneda: ${m.Moneda}</li>
            <li>total: ${m.total}</li>
            <li>tipoDeComprobante: ${m.tipoDeComprobante}</li>
            <li>metodoDePago: ${m.metodoDePago}</li>
            <li>LugarExpedicion: ${m.LugarExpedicion}</li>
          </ul>
        </details>
      `
      })}
    </body>
    </html>
  `
}

let archivos = fs.readdirSync('./')

let mapeo = archivos
  .filter(a => a.includes('.json') && !a.includes('package'))
  .map(a => {
    let comprobante = jsonfile.readFileSync(a)['cfdi:Comprobante']
    console.log(`Mapeando ${a}`)
    return {
      version: comprobante.$.version,
      serie: comprobante.$.serie,
      folio: comprobante.$.folio,
      fecha: comprobante.$.fecha,
      subTotal: comprobante.$.subTotal,
      TipoCambio: comprobante.$.TipoCambio,
      Moneda: comprobante.$.Moneda,
      total: comprobante.$.total,
      tipoDeComprobante: comprobante.$.tipoDeComprobante,
      metodoDePago: comprobante.$.metodoDePago,
      LugarExpedicion: comprobante.$.LugarExpedicion,
      UUID: comprobante['cfdi:Complemento'][0]['tfd:TimbreFiscalDigital'][0].$.UUID
    }
  })

fs.writeFileSync('./compilado.html', creaHTML(mapeo))

