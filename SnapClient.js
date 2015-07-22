#!/usr/bin/env node

var zfsGroup = require('./');
var zfsFilesystemViews = require(__dirname+'/../zfsFilesystemViews');
var Setup = zfsFilesystemViews.Snapshot.Servers.List;
Setup.server = 'beo';

/*
zfsGroup({
    key: 'S1napshotServers',
    field: 2,
    ttl: 30,
    server: 'beo',
    matches: ['tank/Snapshots/[a-z]*.[a-z]/tank$'],
},*/
zfsGroup(Setup, function(e, Filesystems) {
    if (e) throw e;
    console.log('FILESYSTEMS');
    console.log(Filesystems);
    console.log(Filesystems.length);
});
