const fs = require('fs').promises;

module.exports = async function fileReaders(filename){
    let x = await fs.readFile(filename,'utf8')
    let data = await JSON.parse(x)
   return data
}