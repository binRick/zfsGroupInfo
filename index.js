var CachemanFile = require('cacheman-file'),
    chalk = require('chalk'),
    _ = require('underscore'),
    child = require('child_process');

var debug = true;

module.exports = function(Setup, CB) {
    Setup = Setup || {};
    CB = CB || function() {};
    Setup.uniqe = Setup.uniq || false;
    Setup.cache = Setup.cache || new CachemanFile();
    Setup.field = Setup.field || false;
    Setup.delimiter = Setup.delimiter || '/';
    Setup.ttl = Setup.ttl || 300;
    Setup.key = Setup.key || 'myZfsGroup';
    Setup.server = Setup.server || 'intrepid';
    Setup.matches = Setup.matches || ['^bank/Voyager/[0-9]*.[0-9]$'];

    var cmd = 'ssh ' + Setup.server + ' zfs list -H -o name | egrep "' + Setup.matches.join('|') + '"';
    if (debug) console.log(chalk.green.bgBlack(cmd));
    Setup.cache.get(Setup.key, function(e, Filesystems) {
        if (e) throw e;
        Filesystems = _.toArray(Filesystems);
        if (!Filesystems || Filesystems.length < 1) {
            child.execSync = child.execSync || require('exec-sync');
            Filesystems = child.execSync(cmd).toString().split('\n').filter(function(l) {
                return l.length > 0;
            });
            Setup.cache.set(Setup.key, Filesystems, Setup.ttl, function(e) {
                if (e) throw e;
            });
        }
        if (Setup.field)
            Filesystems = Filesystems.map(function(fs) {
                return fs.split(Setup.delimiter)[Setup.field];
            });
    if(Setup.unique)
            Filesystems = _.uniq(Filesystems);

        CB(e, Filesystems);
    });
};
