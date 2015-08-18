/**
 * A Node in the autocompleter Trie.
 */
Node = function () {
    /* The maximum score of all the values in this element
     * or its children */
    this.score = 0;

    /* The children of the trie indexed by letter.
     * {a: new Node(), b: new Node(), ...}
     */
    this.children = {};

    /* Both the children and values of the tree,
     * sorted by score.
     * We use one list for convenient sorting, but
     * it's kind of unhygenic.
     */
    this.values = [];
    /* Indicates whether the list of values is sorted.
     * Because building the tree takes a significant amount of
     * time, and we probably won't use most of it, the tree is
     * left unsorted until query time.
     *
     * This is an amortised cost, paid back in small doses over
     * the first few queries to the tree.
     */
    this.sorted = true;

    /* If there is only one value in this node, we don't
     * create a full letter-by-letter trie out of it.
     * Instead we just store it as the .tail.
     * This makes creating the tree ~5x faster.
     *
     * TODO:CI it might be even faster still to use a fully
     * compressed trie, to take advantage of the common
     * mid-sections in words.
     */
    this.tail = null;
    this.tailIndex = 0;
}

/* Add a new item to the node.
 *
 * The item has a .key, .score and .value, and the index indicates the position in
 * the key (i.e. the depth in the trie) that this node is responsible for.
 */
Node.prototype.add = function (item, index) {

    if (item.score > this.score) {
        this.score = item.score;
    }

    // If there are no values, make an optimized tail node.
    if (!this.tail && !this.values.length) {
        this.tail = item;
        this.tailIndex = index;
        return;
    }

    // If there is already a value, just set sorted to false,
    // we'll fix it at query time.
    if (this.values.length) {
        this.sorted = false;
    }

    // If this node is the last in the chain, then just push
    // the item onto the values list.
    if (index === item.key.length) {
        this.values.push(item);

    // Otherwise create a child node and shunt responsibility
    // to it.
    } else {

        var chr = item.key[index];

        if (!this.children[chr]) {
            this.children[chr] = new Node();
            this.values.push(this.children[chr]);
        }

        this.children[chr].add(item, index + 1);
    }

    // If the node used to have a tail, re-add it as
    // a proper node.
    if (this.tail) {
        var tail = this.tail;
        this.tail = null;
        this.add(tail, this.tailIndex);
    }
}

// Find the node responsible for the given prefix.
// Index indicates how far we've looked already.
// Returns null if no such node could be found.
Node.prototype.findPrefix = function (key, index) {

    if (index === key.length) {
        return this;
    }

    if (this.tail && this.tail.key.slice(index).indexOf(key.slice(index)) === 0) {
        return this;
    }

    var chr = key[index];
    if (this.children[chr]) {
        return this.children[chr].findPrefix(key, index + 1);
    }

    return null;
}

/**
 * Recurse over all child nodes to get the top N results by score.
 *
 * We do this using a best-first-search with the score we've cached
 * on each node.
 *
 * We use the passed in pqueue which has a limit and unique flag to
 * configure the search.
 */
Node.prototype.getSortedResults = function (results, opts, pqueue) {

    var seenKeys = {};

    pqueue.addList([this]);

    while (next = pqueue.pop()) {
        if (next instanceof Node) {
            if (next.tail) {
                pqueue.addList([next.tail]);
            } else {
                if (!next.sorted) {
                    next.values.sort(function (a, b) {
                        return b.score - a.score;
                    });
                    next.sorted = true;
                }

                pqueue.addList(next.values);
            }
        } else {
            if (!opts.unique || !seenKeys[next.key + (next.distinct ? next.distinct : "")]) {
                seenKeys[next.key] = true;
                results.push(next.value);
            }

            if (results.length === opts.limit) {
                return;
            }
        }
    }
}

module.exports = Node;
