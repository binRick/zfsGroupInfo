module.exports = {
	CollectServersCommand: 'ssh intrepid zfs list -H -o name | grep ^bank/Voyager/[0-9]*.[0-9]$',
};
