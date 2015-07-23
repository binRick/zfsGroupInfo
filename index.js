var CachemanFile = require('cacheman-file'),
    md5=require('md5'),
    chalk = require('chalk'),
    _ = require('underscore'),
    child = require('child_process');

var debug = true;

module.exports = function(Setup, CB) {
    Setup = Setup || {};
    CB = CB || function() {};
	var pre = 'ssh beo';
    Setup.uniqe = Setup.uniq || false;
    Setup.cache = Setup.cache || new CachemanFile();
    Setup.field = Setup.field || false;
    Setup.delimiter = Setup.delimiter || '/';
    Setup.ttl = Setup.ttl || 300;
    Setup.server = Setup.server || 'intrepid';
    Setup.matches = Setup.matches || ['^bank/Voyager/[0-9]*.[0-9]$'];
    Setup.bin = Setup.bin || 'zfs';
	Setup.args = Setup.args || 'list -H -o name';
    var cmd = pre +' ' + 'ssh ' + Setup.server + ' ' + Setup.bin +  ' ' + Setup.args + ' | egrep "' + Setup.matches.join('|') + '"';
    Setup.key = md5(Setup.server+Setup.bin+Setup.args);
    if (debug) console.log(chalk.green.bgBlack(cmd));
    Setup.cache.get(Setup.key, function(e, Filesystems) {
        if (e) throw e;
        Filesystems = _.toArray(Filesystems);
        if (!Filesystems || Filesystems.length < 1) {
            child.execSync = child.execSync || require('exec-sync');
	    console.log(chalk.red.bgWhite('Cache miss'));
            Filesystems = child.execSync(cmd).toString();
	if(Filesystems.split('\n').length==0)
		Filesystems=[Filesystems];
	else
	    Filesystems = Filesystems.split('\n').filter(function(l) {
                return l.length > 0;
            });
            Setup.cache.set(Setup.key, Filesystems, Setup.ttl, function(e) {
                if (e) throw e;
	console.log(Filesystems, Setup.key,' CACHE SET');
            });
        }else{
	    console.log(chalk.green.bgWhite('Cache hit!'));
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
