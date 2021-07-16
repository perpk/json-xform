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

const traverseTemplate = (source, xFormTemplate) => {
    for (const prop in xformTemplate) {
        if (prop === commands.FIELDSET) {
            traverseFieldset(xFormTemplate, prop);
        }
        if (prop === commands.FROMEACH) {

        }

    }
};

const traverseFieldset = (template, prop) => {
    template[prop].forEach((item) => {
        traverseTemplate(item);
    });
}

module.exports = {mapToNewObject, mapWithTemplate, traverseTemplate};