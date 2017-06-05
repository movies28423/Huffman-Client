var Node = function(ch, count, left, right){
  this.ch = ch;
  this.count = count;
  this.left = left;
  this.right = right;
}

Node.prototype.updateCount = function(){
  this.count++;
}

module.exports = {
  'Node': Node
};