let HuffmanWriter = require('/Users/stephanie/Huffman/HuffmanWriter.js').HuffmanWriter;
let fs = require('fs');

var m = fs.readFileSync('test.txt', 'utf8');
var hw = new HuffmanWriter(m, 'test.zip');
hw.writeToZip();