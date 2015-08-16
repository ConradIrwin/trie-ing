var assert = require('assert');
var Trie = require('../index.js');

describe('Trie', function () {

    it('should allow value retrieval', function () {

        var t = new Trie();

        var item = {
            key: "one",
            value: [1],
            score: 1
        }

        t.add(item);

        assert.equal(item, t.prefixSearch("o")[0])
        assert.equal(item, t.prefixSearch("on")[0])
        assert.equal(item, t.prefixSearch("one")[0])
    });

    it("should sort values by score", function () {
        var aaa = {
            key: "aaa",
            value: [2],
            score: 2
        }
        var aaa2 = {
            key: "aaa",
            value: [4],
            score: 4
        }
        var aab = {
            key: "aab",
            value: [3],
            score: 3
        }
        var abb = {
            key: "abb",
            value: [1],
            score: 1
        }

        var t = new Trie();

        t.add(aaa);
        t.add(aab);
        t.add(abb);
        t.add(aaa2);

        results = t.prefixSearch("a");
        assert.equal(results[0], aaa2);
        assert.equal(results[1], aab);
        assert.equal(results[2], aaa);
        assert.equal(results[3], abb);
    });

});

