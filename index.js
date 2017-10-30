var Node = require('./lib/node');
var PQueue = require('./lib/pqueue');

/**
 * A Trie optimized for weighted autocompletion returning a small number
 * of results.
 *
 * It can take an optional ({maxWidth: X}) parameter. This parameter is
 * set relatively large because we care a lot about indexing time, and
 * lookup is so fast that slowing it down by a factor of 10 is still
 * fast enough for more most use-cases.
 *
 * NOTE: The factor only affects the first lookup for any given prefix,
 * after a trie mutation. After that the widthFactor is mostly irrelevant.
 */
var Trie = function (options) {
    this.root = new Node();
    if (options && options.maxWidth) {
      this.maxWidth = options.maxWidth;
    } else {
      this.maxWidth = 500;
    }
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
    this.root.add(item, 0, this.maxWidth);
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

    if (!node) {
      return results;
    }

    node.getSortedResults(prefix, results, opts, new PQueue(opts.limit));

    return results;
};

module.exports = Trie;
