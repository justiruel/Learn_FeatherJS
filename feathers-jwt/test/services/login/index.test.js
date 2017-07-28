'use strict';

const assert = require('assert');
const app = require('../../../src/app');

describe('login service', function() {
  it('registered the logins service', () => {
    assert.ok(app.service('logins'));
  });
});
