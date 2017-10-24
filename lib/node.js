/**
 * A Node in the autocompleter Trie.
 */
var Node = function () {
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

    this.leaf = true;
}

/* Add a new item to the node.
 *
 * The item has a .key, .score and .value, and the index indicates the position in
 * the key (i.e. the depth in the trie) that this node is responsible for.
 */
Node.prototype.add = function (item, index, maxWidth) {

    if (item.score > this.score) {
        this.score = item.score;
    }

    if (this.leaf && index < item.key.length && this.values.length > maxWidth) {
        var oldValues = this.values;
        this.values = [];
        this.leaf = false;
        for (var i = 0; i < oldValues.length; i++) {
          var item = oldValues[i],
            chr = item.key[index];

          if (!this.children[chr]) {
              this.children[chr] = new Node();
              this.values.push(chr);
          }

          this.children[chr].add(item, index + 1, maxWidth);
        }
    }

    if (this.leaf) {
        this.values.push(item)
    } else {
        var chr = item.key[index];

        if (!this.children[chr]) {
            this.children[chr] = new Node();
            this.values.push(chr);
        }

        this.children[chr].add(item, index + 1, maxWidth);
    }

    this.sorted = false;
}

Node.prototype.sort = function () {
  if (this.sorted) { return }
  this.sorted = true;

  if (this.leaf) {
    this.values.sort(function (a, b) {
      return b.score - a.score;
    })

  } else {
    this.values.sort(function (a, b) {
      return this.children[b].score -  this.children[a].score;
    }.bind(this))
  }

}

// Find the node responsible for the given prefix.
// Index indicates how far we've looked already.
// Returns null if no such node could be found.
Node.prototype.findPrefix = function (key, index) {

    if (this.leaf || index == key.length) {
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
Node.prototype.getSortedResults = function (prefix, results, opts, pqueue) {

    var seenKeys = {};

    if (this.leaf) {
      if (!this.sorted) {
        this.sort()
      }

      for (var item of this.values) {
        if (item.key.startsWith(prefix)) {
            if (!opts.unique || !seenKeys[item.key + "\uffef" + (item.distinct ? item.distinct : "")]) {
                seenKeys[item.key + "\uffef" + (item.distinct ? item.distinct : "")] = true;
                results.push(item.value);

                if (results.length == opts.limit) {
                  return;
                }
            }
        }
      }
    } else {

      pqueue.addList([this]);

      while (next = pqueue.pop()) {
          if (next instanceof Node) {
              if (!next.sorted) {
                  next.sort()
              }

              if (next.leaf) {
                pqueue.addList(next.values);
              } else {
                pqueue.addList(next.values.map((v) => {
                  return next.children[v]
                }))
              }
          } else {
              if (!opts.unique || !seenKeys[next.key + "\uffef" + (next.distinct ? next.distinct : "")]) {
                  seenKeys[next.key + "\uffef" + (next.distinct ? next.distinct : "")] = true;
                  results.push(next.value);
              }

              if (results.length === opts.limit) {
                  return;
              }
          }
      }
    }
}

module.exports = Node;
