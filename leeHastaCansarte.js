
let lee1000archivos = require('./lee1000archivos')

let cuantosQuedan = 1000
let interval = setInterval(() => {
  if (cuantosQuedan < 1000 ) {
    clearInterval(interval)
  }
  console.log('otra vez')
  cuantosQuedan = lee1000archivos()
  console.log(cuantosQuedan)
}, 30000);

