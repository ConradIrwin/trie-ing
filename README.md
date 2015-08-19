The fastest weighted auto-completion trie known to me.

Introduction
============

Yet another trie? "Why?" I hear you cry! I know, it's trie-ing...

For [Superhuman](http://superhuman.com) we're building a product focussed around speed and
productivity. To do this we need to run an auto-completer over your contacts, ordered by how
recently you contacted them.

Most tries return results in alphabetical order, this trie returns them by descending score.

This trie structure can index my 285kb of contact data in ~11ms, and provide auto-completion
results ordered by how recently I've communicated with them in ~0.25ms. This improves over
the original linear search (which took ~40ms) and first stab at using a trie (~55ms index, ~20ms search).

Usage
=====

First install. In this example I'm using npm, but browserify or copy-paste works just fine.

```
npm install trie-ing
```

Then use it

```javascript

var Trie = require('trie-ing');

var trie = new Trie();

trie.add({
    key: "richard",
    value: {name: "Richard", ...},
    score: 5
});

trie.add({
    key: "rachael",
    value: {name: "Rachael", ...},
    score: 1
});

trie.add({
    key: "sarah",
    value: {name: "Sarah", ...},
    score: 3
});

trie.add({
    key: "sam",
    value: {name: "Sam", ...},
    score: 2
});

// The limit option limits the number of results.
// The unique option returns only the first result for each key
// (the trie can store multiple values per key)
trie.prefixSearch('r', {limit: 3, unique: true})
//=> [{name: "Richard", ...} , {name: "Rachael", ...}]
```

Efficiency
==========

The problem with building a search tree for contacts is that the order of
results is orthogonal from the search.

If I type "R", my dad ("Richard") should be the first auto-completion result, not
my friend "Rachael" who I haven't spoken to for a year.

To do this nodes in the trie have their highest score attached:

```
                     + (4) rachael
           + (4) r --+ (1) richard
  root ----+
           + (3) s ---+ (3) a ---+ (3) sarah
                                 + (2) sam
```

To improve indexing time, sub-nodes are not sorted; so on the first access to
each section of the tree you have to pay the cost of sorting the sub-nodes (
this is usually a very small sort, <5 entries, per node in the tree).

There's also a special case for nodes with one child, where we don't expand
them out letter by letter. (An exercise for the reader would be to use a
fully compressed trie, which would give us this optimization as a side-effect)

The search algorithm maintains a queue of nodes to visit based on score, and is
truncated to the limit. The most expensive part of the search is merging the
current node's children into the priority queue, and so the efficiency of lookup
is dominated by the limit parameter, with some additional cost due to having to
traverse many intermediate nodes (see note about implementing a compressed trie).

Meta-fu
=======

This code base started out as the trie implementation from
https://github.com/marccampbell/node-autocomplete packaged in a way I can use
it in the browser, but has been significantly alterred.

See LICENSE for original copyright holder, changes are also released under the MIT license.
