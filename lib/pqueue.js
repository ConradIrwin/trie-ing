var Node = require('./node');
/* A PQueue with a limited size.
 *
 * The unique flag is an implementation detail, when
 * set to true it will only pick the highest scoring item
 * from each node. Which provides unique key behaviour for
 * prefixSearching.
 */
var PQueue = function (limit, unique) {
    this.todo = [];
    this.limit = limit;
};

PQueue.prototype.addList = function (list) {

    var i = 0, j = 0;

    // effectiveLength is the lower bound on the number of
    // item's we're guaranteed to be able to find in the trie.
    // In the case that unique is false this is the same as the length,
    // but in the case unique is true, it's the number of Nodes in the queue
    // (as items may be discarded).
    var effectiveLength = 0;

    while (i < this.todo.length && effectiveLength < this.limit) {

        if (j < list.length && this.todo[i].score < list[j].score) {
            this.todo.splice(i, 0, list[j]);
            j += 1;
        }

        if (this.todo[i] instanceof Node) {
            effectiveLength += 1;
        }

        i += 1;
    }

    while (this.todo.length > i) {
        this.todo.pop();
    }

    while (effectiveLength < this.limit && j < list.length) {
        this.todo.push(list[j]);
        if (list[j] instanceof Node) {
            effectiveLength += 1;
        }
        j += 1;
    }
};

PQueue.prototype.pop = function () {
    return this.todo.shift();
};

module.exports = PQueue;
