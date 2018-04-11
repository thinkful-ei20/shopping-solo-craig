/* global cuid */
'use strict';

const Item = (function() {
  const validateName = function(name) {
    if (!name) throw new TypeError('');
  };

  const create = function(name) {
    return {
      id: cuid(),
      name: name,
      checked: false,
    };
  };

  return {
    validateName,
    create,
  };
}());