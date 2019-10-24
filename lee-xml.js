let fs = require('fs')
let jsonfile = require('jsonfile')
let xml2js = require('xml2js');
let archivos = fs.readdirSync('./')
console.log(archivos);

let parser = new xml2js.Parser()

// console.log(xml1)

let control = jsonfile('./json')

archivos.forEach(a => {
  if (a.includes('.xml')){

    let xml = fs.readFileSync(a).toString()

    parser.parseString(xml, function (err, result) {
      // console.dir(result);
      // console.log(Object.keys(result));
      jsonfile.writeFileSync(`./${a}.json`, result)
      console.log(`Creando ${a}.json`);
    });
  }

})
