var assert = require('assert');
var Trie = require('../index.js');

describe('Trie', function () {

    it('should allow value retrieval', function () {

        var t = new Trie();

        var item = {
            key: "one",
            value: 1,
            score: 1
        }

        t.add(item);

        assert.equal(1, t.prefixSearch("o")[0])
        assert.equal(1, t.prefixSearch("on")[0])
        assert.equal(1, t.prefixSearch("one")[0])
    });

    it("should sort values by score", function () {
        var aaa = {
            key: "aaa",
            value: 2,
            score: 2
        }
        var aaa2 = {
            key: "aaa",
            value: 4,
            score: 4
        }
        var aab = {
            key: "aab",
            value: 3,
            score: 3
        }
        var abb = {
            key: "abb",
            value: 1,
            score: 1
        }

        var t = new Trie();

        t.add(aaa);
        t.add(aab);
        t.add(abb);
        t.add(aaa2);

        results = t.prefixSearch("a");
        assert.equal(results[0], 4);
        assert.equal(results[1], 3);
        assert.equal(results[2], 2);
        assert.equal(results[3], 1);
    });

    it("should be able to find a limited set of results", function () {

        var t = new Trie();

        t.add({
            key: "aaa",
            value: 4,
            score: 4
        })

        t.add({
            key: "aaa",
            value: 3,
            score: 3
        })

        t.add({
            key: "aab",
            value: 2,
            score: 2
        })

        t.add({
            key: "abb",
            value: 1,
            score: 1
        })

        assert.deepEqual([4,2,1], t.prefixSearch("a", {limit: 3, unique: true}));
        assert.deepEqual([4,3,2], t.prefixSearch("a", {limit: 3, unique: false}));
    });


    it("should return an empty array if nothing is found", function () {
        assert.deepEqual([], new Trie().prefixSearch("a"));

        t = new Trie();
        t.add({
            key: "gaa",
            value: 2,
            score: 2
        });

        assert.deepEqual([], t.prefixSearch("gb"));
    });

    it("should return the highest scoring match of duplicates", function () {

        t = new Trie();
        t.add({
            key: "abc",
            value: 2,
            score: 2
        });

        t.add({
            key: "abc",
            value: 4,
            score: 4
        });

        assert.deepEqual([4], t.prefixSearch("abc", {limit: 1}));

    });

    it("should be able to prefix match with tails", function () {

        t = new Trie();
        t.add({
            key: 'sarah',
            value: 1,
            score: 1
        });

        t.add({
            key: 'shashi',
            value: 2,
            score: 2
        });

        assert.deepEqual([2], t.prefixSearch("sha"));
    });
});

