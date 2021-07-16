const {readJSON} = require("./ioUtils");
const {addPropToTarget} = require('./constructTarget');

const commands = {
    FIELDSET: 'fieldset',
    FROM: 'from',
    TO: 'to',
    FROMEACH: 'fromEach'
  };

const mapWithTemplate = (sourceFile, xformTemplateFile) => {
    const source = readJSON(sourceFile);
    const xformTemplate = readJSON(xformTemplateFile);

    return mapSourceToTarget(source, xformTemplate);
};

const mapToNewObject = (source, xFormTemplate) => {

    return {};
};


const traverseFromEach = () => {
    // TODO implement me!
    throw Error('Not implemented yet!')
}

const traverseFieldset = (template, prop, target) => {
    template[prop].forEach((item) => {
        if (item.fromEach) {
            traverseFromEach();
        }
        // ! TODO continue implementation...
        // target = addPropToTarget()
    });
}

const traverseTemplate = (source, xFormTemplate, target) => {
    for (const prop in xformTemplate) {
        if (prop === commands.FIELDSET) {
            traverseFieldset(xFormTemplate, prop, target);
        }
        if (prop === commands.FROMEACH) {
            traverseFromEach();
        }

    }
};
module.exports = {mapToNewObject, mapWithTemplate, traverseTemplate};