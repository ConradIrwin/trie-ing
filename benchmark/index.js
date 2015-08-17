global.contacts = require('./contacts.json');
var Trie = require('../index.js');

var Benchmark = require('benchmark');
var suite = new Benchmark('Populate#trie', function () {

    global.t = new Trie();

    contacts.feed.entry.forEach(function (data) {
        if (!data.gd$email) {
            return;
        }

        var email = data.gd$email[0].address.trim().toLowerCase() || "";
        var name = (data.title.$t || email.split("@")[0].trim() || "").toLowerCase();

        var score = new Date(data.updated.$t).getTime();

        t.add({
            key: email,
            score: score,
            value: data
        });

        t.add({
            key: name,
            score: score,
            value: data
        });
    });

});
suite.run();
console.log(suite.toString());

console.log(t.prefixSearch('rahul', {limit: 3, unique: true}));

var suite = new Benchmark('LookupPrefix', function () {

    t.prefixSearch('r', {limit: 3, unique: true});

});
suite.run();

console.log(suite.toString());
var suite = new Benchmark('LookupPrefix', function () {

    t.prefixSearch('r', {limit: 6, unique: true});

});
suite.run();

console.log(suite.toString());
