// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const exclusionList = require('metro-config/src/defaults/exclusionList');

// exclusionList is a function that takes an array of regexes and combines
// them with the default exclusions to return a single regex.

module.exports = getDefaultConfig(__dirname);
module.exports.resolver = {
    blacklistRE: exclusionList([/electron\/.*/])
};
