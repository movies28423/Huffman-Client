let HuffmanReader = require('/Users/stephanie/Huffman/HuffmanReader.js').HuffmanReader;
let BitStream = require('/Users/stephanie/Huffman/BitStream.js').BitStream;
let fs = require('fs');

readIncomingFile = function() {

  fs.readFile('test.zip', function(err, fd){

    if (err) {
      if (err.code === 'ENOENT') {
        console.error('myfile does not exist');
        return;
      }

      throw err;
    }

    var bitStream = new BitStream(fd);
    hr = new HuffmanReader(bitStream);
    var decodedMessage = hr.getDecodedMessage();
    console.log(decodedMessage);

  });

};

readIncomingFile();