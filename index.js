var    CachemanFile = require('cacheman-file'),
    _ = require('underscore'),
    child = require('child_process');

module.exports = function(Setup, CB) {
	Setup = Setup || {};
	CB = CB || function(){};
    Setup.cache = Setup.cache || new CachemanFile();
    Setup.ttl = Setup.ttl || 300;
    Setup.key = Setup.key || 'myZfsGroup';
    Setup.server = Setup.server || 'intrepid';
    Setup.matches = Setup.matches || ['^bank/Voyager/[0-9]*.[0-9]$'];

    var cmd = 'ssh ' + Setup.server + ' zfs list -H -o name | egrep "' + Setup.matches.join('|') + '"';
    Setup.cache.get(Setup.key, function(e, Servers) {
        if (e) throw e;
        Servers = _.toArray(Servers);
        if (!Servers || Servers.length < 1) {
            child.execSync = child.execSync || require('exec-sync');
            Servers = child.execSync(cmd).toString().split('\n').filter(function(l) {
                return l.length > 0;
            });
            Setup.cache.set(Setup.key, Servers, Setup.ttl, function(e) {
                if (e) throw e;
            });
        }
        CB(e, Servers);
    });
};
