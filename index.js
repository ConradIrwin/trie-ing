var Node = require('./lib/node');
var PQueue = require('./lib/pqueue');

/**
 * A Trie optimized for weighted autocompletion returning a small number
 * of results.
 */
var Trie = function () {
    this.root = new Node();
};

/**
 * Add a new item to the auto-completer.
 *
 * It should have:
 * a .key property that is a non-empty string.
 * a .score property that is a positive number.
 * a .value property that is opaque (and returned by the prefixSearch method)
 * a .distinct property that is used to distinguish between multiple values that have the same key.
 */
Trie.prototype.add = function (item) {
    this.root.add(item, 0);
};

/**
 * Prefix search terms in the auto-completer.
 *
 * Returns an array of values that have keys starting with the prefix.
 *
 * You are encouraged to pass an options object with:
 * a .limit to limit the number of results returned.
 * a .unique property if you only want one result per-key.
 *
 * The limit is particularly important because the performance of the
 * algorithm is determined primarily by the limit.
 */
Trie.prototype.prefixSearch = function (prefix, opts) {
    var results = [];
    var node = this.root.findPrefix(prefix, 0);

    if (!opts) {
        opts = {};
    }

    if (opts.limit == null) {
        opts.limit = 1 / 0;
    }

    if (node) {
        node.getSortedResults(results, opts, new PQueue(opts.limit));
    }

    return results;
};

module.exports = Trie;
