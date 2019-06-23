#!/usr/bin/env node

const GhostExport = require('../lib/ghost-export'),
  JsonGhostExport = require('../lib/json-ghost-export'),
  package = require('../package.json'),
  program = require('commander')
    .version(package.version)
    .usage('[options...] [source] [destination]')
    .option('-j --jsonexport', 'Export file is a JSON file from Ghost v2+')
    .option('-d --drafts', 'Export drafts only')
    .option('-a --all', 'Export both published posts and drafts');

program.on('--help', function() {
  console.log('  Description:');
  console.log('');
  console.log('    ' + package.description);
  console.log('');
  console.log('  Examples:');
  console.log('');
  console.log('    # Export published posts only');
  console.log('    $ ghost-export /path/to/ghost/app /path/to/output');
  console.log('');
  console.log('    # Export drafts only');
  console.log('    $ ghost-export --drafts /path/to/ghost/app /path/to/output');
  console.log('');
  console.log('    # Export all posts');
  console.log('    $ ghost-export --all /path/to/ghost/app /path/to/output');
  console.log('');
  console.log('    # Export posts from a Ghost JSON export file');
  console.log('    $ ghost-export --jsonexport /path/to/ghost/jsonfile /path/to/output');
  console.log('');
});

program.parse(process.argv);
var args = {
  source: program.args.shift(),
  destination: program.args.shift(),
  published: !program.drafts || program.all ? true : false,
  drafts: program.drafts || program.all,
  sourceType: program.jsonexport ? 'json' : 'sqlite'
};
if (args.sourceType === 'sqlite') {
  console.log('test');

  GhostExport(args, function(err, count) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
  });
} else if (args.sourceType === 'json') {
  JsonGhostExport(args, function(err, count) {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
  });
}
