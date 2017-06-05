/**********************************************************************
 * 
 * Utilities class to help with Bit Operations
 *
 */

var BitOperatorHelper = new Object();

BitOperatorHelper.constants = {

    BITS_IN_BYTES : 8,

    BITS_IN_BYTES_INDEXED_AT_ZERO : 7,

    ASCII_CHAR_ENCODING_LENGTH : 7,
    
    BINARY_RADIX : 2

}

//adds zero to binary string to pad to certain length
BitOperatorHelper.padToXthBit = function(binaryString, bitsToPad) {

    var padding = [];
    for (var i = 0; i < bitsToPad; i++) {
        padding.push("0");
    }

    return padding.join("") + binaryString; 

}

BitOperatorHelper.charToBinary = function(char) {

    var binaryString = char.charCodeAt(0).toString(this.constants.BINARY_RADIX);
    return binaryString;

}

//sets Xth bit will mask the rest, starting from most significant digit
BitOperatorHelper.setXthBit = function(bitPosition, nonMaskingBit, maskingBit, reverseBitPosition) {

    //bit shifting starts at the right, read the bits in the stream from the left
    //feels more intuitive to pass in the way the stream is reading
    //and reverse the position here
    var reverse = reverseBitPosition != undefined && reverseBitPosition;

    var calcBitPosition = reverse 
      ? this.constants.BITS_IN_BYTES_INDEXED_AT_ZERO - bitPosition 
      : bitPosition;

    //build the mask by left shifting the non masking bit to the bit position to set
    var mask = nonMaskingBit << calcBitPosition;

    for (var i = 0; i < this.constants.BITS_IN_BYTES; i++) {

        if (i != bitPosition) {
            //set the rest of the bits in the mask to the masking bit value or leave at zero, if the zero is the masking bit
            mask |= (maskingBit << (this.constants.BITS_IN_BYTES_INDEXED_AT_ZERO - i));
        }

        i++;

    }

    return mask;

}

module.exports = {
    'BitOperatorHelper': BitOperatorHelper
};