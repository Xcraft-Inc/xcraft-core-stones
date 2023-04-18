/* eslint-disable jsdoc/require-returns-description */
/* eslint-disable jsdoc/require-param-description */
/* eslint-disable jsdoc/valid-types */
// @ts-check

const fullTypeName = require('./full-type-name');
/**
 * @typedef {import("./check-error.js").CheckError} CheckError
 */

/**
 * @param {CheckError} error
 * @param {string | number} space
 * @returns {string}
 */
module.exports = function errorMessage(error, space = 2) {
  const name = error.errorName;

  let spaceStr = '';
  if (space) {
    spaceStr += '\n';
    if (typeof space === 'number') {
      spaceStr += ' '.repeat(space);
    } else {
      spaceStr += space;
    }
  }

  let pathText = '';
  if (error.path && error.path.length !== 0) {
    if (space) {
      pathText += spaceStr;
    } else {
      pathText += ' ';
    }
    pathText += `at '${error.path.join('.')}'`;
  }

  let typeText = '';
  if (error.type) {
    const typeName = fullTypeName(error.type);
    typeText = `with type '${typeName}'`;
    if (space) {
      typeText = spaceStr + typeText;
    } else {
      typeText = ' ' + typeText;
    }
  }

  let infoText = '';
  if (error.info) {
    const info = {...error.info};
    if (info.errors) {
      info.errors = info.errors.map((error) => errorMessage(error, ''));
    }
    let infoStr = JSON.stringify(info, null, space);
    if (space) {
      infoStr = infoStr.replace(/[\n]/g, spaceStr);
      infoText = `${spaceStr}info: ${infoStr}`;
    } else {
      infoText = `: ${infoStr}`;
    }
  }

  return `${name}${pathText}${typeText}${infoText}`;
};
