Node = require('./node')

/* A PQueue with a limited size.
 *
 * The unique flag is an implementation detail, when
 * set to true it will only pick the highest scoring item
 * from each node. Which provides unique key behaviour for
 * prefixSearching.
 */
PQueue = function (limit, unique) {
    this.todo = [];
    this.limit = limit;
    this.unique = unique;
}

PQueue.prototype.addList = function (list) {

    var i = 0, j = 0;

    var noMoreItems = false;

    while (i < this.todo.length && i < this.limit && j < list.length) {

        if (this.todo[i].score < list[j].score) {
            if (!(noMoreItems && !(list[j] instanceof Node))) {
                this.todo.splice(i, 0, list[j]);
                noMoreItems = this.unique;
                i += 1;
            }
            j += 1;
        } else {
            i += 1;
        }

        if (this.unique && !(list[j] instanceof Node)) {
            noMoreItems = true;
        }
    }

    while (this.todo.length < this.limit && j < list.length) {
        if (!(noMoreItems && !(list[j] instanceof Node))) {
            this.todo.push(list[j]);
        }
        j += 1;

        if (this.unique && !(list[j] instanceof Node)) {
            noMoreItems = true;
        }
    }

    while (this.todo.length > this.limit) {
        this.todo.pop();
    }
}

PQueue.prototype.pop = function () {
    return this.todo.shift();
}

module.exports = PQueue;
