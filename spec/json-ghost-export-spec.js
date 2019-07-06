var JsonGhostExport = require('../lib/json-ghost-export'),
  fs = require('fs'),
  path = require('path');

describe('JsonGhostExport', function() {
  describe('arguments', function() {
    beforeEach(function() {
      err = null;
    });

    it('should require a source', function() {
      JsonGhostExport({ destination: 'output' }, function(e) {
        err = e;
      });

      expect(err.message).toMatch('No source Ghost export file specified');
    });

    it('should require a destination', function() {
      JsonGhostExport({ source: 'fixtures/ghost/export.json' }, function(e) {
        err = e;
      });

      expect(err.message).toMatch('No destination directory specified');
    });
  });
});
