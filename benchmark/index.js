global.contacts = require('./contacts.json');
var Trie = require('../index.js');

var Benchmark = require('benchmark');
var suite = new Benchmark('Populate#trie', aaa = function () {

    global.t = new Trie();
    global.nodeCount = 0;

    contacts.forEach(function (data) {

        var email = (data.email || "-").toLowerCase();
        var name = data.name.toLowerCase();

        var score = data.score;

        t.add({
            key: email,
            score: score,
            value: data,
            distinct: email + name
        });

        t.add({
            key: name,
            score: score,
            value: data,
            distinct: email + name
        });

    });


});

suite.run();

console.log(suite.toString());

p = process.hrtime()
t.prefixSearch('t', {limit: 5, unique: true})
p2 = process.hrtime()
console.log((p2[0] - p[0]) * 1e3 + (p2[1] - p[1]) / 1e6)
p = process.hrtime()
t.prefixSearch('tee', {limit: 5, unique: true})
p2 = process.hrtime()
console.log((p2[0] - p[0]) * 1e3 + (p2[1] - p[1]) / 1e6)

var suite = new Benchmark('LookupPrefix', function () {

    t.prefixSearch('tee', {limit: 3, unique: true});

}, {setup: aaa});
suite.run();

console.log(suite.toString());
var suite = new Benchmark('LookupPrefix', function () {

    t.prefixSearch('tee', {limit: 6, unique: true});

});
suite.run();

console.log(suite.toString());
