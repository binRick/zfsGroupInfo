#!/usr/bin/env node

var zfsGroup = require('./');

zfsGroup({
    key: 'myZ2FS1',
    matches: ['bank/Voyager/[0-9]*.[0-9]$'],
}, function(e, Filesystems) {
    if (e) throw e;
    console.log('FILESYSTEMS');
    console.log(Filesystems);
});