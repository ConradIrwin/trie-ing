Node = function () {
    this.score = 0;
    this.children = {};
    this.values = [];
    this.sorted = true;
}

Node.prototype.add = function (item, index) {
    if (item.score > this.score) {
        this.score = item.score;
    }

    // only set sorted to false if there are multiple values,
    // TODO: insertion sort on values?
    if (this.values.length) {
        this.sorted = false;
    }

    if (index === item.key.length) {
        this.values.push(item);
    } else {

        var chr = item.key[index];

        if (!this.children[chr]) {
            this.children[chr] = new Node();
            this.values.push(this.children[chr]);
        }

        this.children[chr].add(item, index + 1);
    }
}

Node.prototype.findPrefix = function (key, index) {

    if (index === key.length) {
        return this;
    }

    var chr = key[index];
    if (this.children[chr]) {
        return this.children[chr].findPrefix(key, index + 1);
    }

    return null;
}

Node.prototype.getSortedResults = function (limit, results, pqueue) {

    pqueue.addList([this]);

    while (next = pqueue.pop()) {
        if (next instanceof Node) {
            if (!next.sorted) {
                next.values.sort(function (a, b) {
                    return b.score - a.score;
                });
                next.sorted = true;
            }

            pqueue.addList(next.values);
        } else {
            results.push(next);

            if (results.length === limit) {
                return;
            }
        }
    }
}

PQueue = function (limit) {
    this.todo = [];
    this.limit = limit;
}

PQueue.prototype.addList = function (list) {

    var i = 0, j = 0;

    while (i < this.todo.length && i < this.limit && j < list.length) {

        if (this.todo[i].score < list[j].score) {
            this.todo.splice(i, 0, list[j]);
            i += 1;
            j += 1;
        } else {
            i += 1;
        }

    }

    while (this.todo.length < this.limit && j < list.length) {
        this.todo.push(list[j]);
        j += 1;
    }

    while (this.todo.length > this.limit) {
        console.log('pop', this.limit);
        this.todo.pop();
    }
}

PQueue.prototype.peek = function () {
    return this.todo[0];
}

PQueue.prototype.pop = function () {
    return this.todo.shift();
}

Trie = function () {
    this.root = new Node();
}

Trie.prototype.add = function (item) {
    this.root.add(item, 0);
}

Trie.prototype.getAll = function (key) {
    var node = this.root.findPrefix(key, 0);

    if (node) {
        return node.values.slice();
    } else {
        return [];
    }

}

Trie.prototype.prefixSearch = function (prefix, limit) {

    var results = [];
    var node = this.root.findPrefix(prefix, 0);

    if (limit == null) {
        limit = 1/0;
    }

    if (node) {
        node.getSortedResults(limit, results, new PQueue(limit));
    }

    return results;
}

module.exports = Trie;
