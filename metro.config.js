// const { getDefaultConfig } = require('@expo/metro-config');
// module.exports = (async () => {
//   const __fromDir = 'node_modules/metro-config'
//   const defaultConfig = await getDefaultConfig(__fromDir);
//   const { assetExts } = defaultConfig.resolver;
//   return {
//     resolver: {
//       // Add bin to assetExts
//       assetExts: [...assetExts, 'bin'],
//     }
//   };
// })();

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.assetExts.push(
  // Adds support for `.db` files for SQLite databases
  'bin'
);

module.exports = config;