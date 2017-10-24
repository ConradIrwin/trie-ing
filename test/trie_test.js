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

    it("should be able to unique even if multiple values have the same score", function () {
        t = new Trie()

        t.add({
            key: "abc",
            value: 1,
            score: 1
        });

        t.add({
            key: "acc",
            value: 1,
            score: 1
        });

        t.add({
            key: "abb",
            value: 1,
            score: 1
        });

        assert.deepEqual([1,1,1], t.prefixSearch("a", {unique: true}));

    });

    it("should be able to distinguish between distinct keys", function () {
        var t = new Trie();

        t.add({
            key: "aaa",
            distinct: "b",
            score: 1,
            value: 1
        });

        t.add({
            key: "aaa",
            distinct: "c",
            score: 2,
            value: 2
        });

        assert.deepEqual([2,1], t.prefixSearch("a", {unique: true}))

    });

    it("should be able to distinguish between distinct keys", function () {
        var t = new Trie();

        t.add({
            key: "aaa",
            distinct: "b",
            score: 3,
            value: 3
        });

        t.add({
            key: "aaa",
            distinct: "b",
            score: 2,
            value: 2
        });

        t.add({
            key: "aaa",
            distinct: "c",
            score: 1,
            value: 1
        });

        assert.deepEqual([3,1], t.prefixSearch("a", {unique: true, limit: 2}))

    });


  it("should work on larger tries", function () {
    this.timeout(5000)
    var contacts = require('../benchmark/contacts.json')

    var t = new Trie();

    for (var i = 0; i < contacts.length; i++) {
      contact = contacts[i];
      t.add({
        key: contact.email,
        distinct: contact.email + contact.name,
        score: contact.score,
        value: contact
      })

      t.add({
        key: contact.name.toLowerCase(),
        distinct: contact.email + contact.name,
        score: contact.score,
        value: contact
      })
    }

    results = t.prefixSearch('t', {limit: 5})
    assert.deepEqual(['tellus.Nunc.lectus@ullamcorpereu.org', 'risus.at.fringilla@Fusce.com', 'tortor@Cras.org', 'tortor@penatibusetmagnis.com', 'tellus.Nunc.lectus@ligulaeuenim.com'], results.map((result) => result.email))

    results = t.prefixSearch('sh', {limit: 5})
    assert.deepEqual(["ornare@acrisus.co.uk", "a.ultricies@a.com", "Etiam.bibendum@necquam.org", "orci.adipiscing.non@euligulaAenean.net", "mi.tempor.lorem@scelerisquedui.ca"], results.map((result) => result.email))

    results = t.prefixSearch('rap', {limit: 5})
    assert.deepEqual(["velit.justo@nonegestas.net", "Fusce.aliquet.magna@esttemporbibendum.net", "auctor.velit.eget@risusDuisa.co.uk", "vehicula.Pellentesque.tincidunt@leoelementumsem.com", "arcu.vel@velitinaliquet.net"], results.map((result) => result.email))

    results = t.prefixSearch('zachary ba', {limit: 5})
    assert.deepEqual(["blandit@duiFuscediam.ca"], results.map((result) => result.email))
  })
});

