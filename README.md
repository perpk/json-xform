# json-xform

## Overview
A library to transform a JSON structure to another one by using an intermediate JSON DSL.
It shall facilitate cases where an application (or an API) needs to process several JSON files
generated by other software clients and to transform it to an internal, common format for further processing.

An example for such a case would be an application which takes reports, perhaps from testing tools and generates tickets or tasks (in Jira for instance).
In order to avoid coding each time when a new tool shall be integrated, the user can provide a mapping by implementing the appropriate DSL alongside with the 
JSON report to process.

## The DSL
The DSL is implemented in JSON. Its vocabulary is limited to five words.
1. fieldset - defines an array of objects, each object encapsulates 
2. from - defines the field to get the value from the source JSON.
3. to - defines the field to write the value to the target JSON.
4. fromEach - defines an object which addresses an array in the source JSON and provides the possibility to pick particular source fields to write to the target JSON by using the fieldset again.
5. field - defines the field in the fromEach block to get the value from.

## Dependencies
The essential libraries used by this project are [jsonpath](https://www.npmjs.com/package/jsonpath) and [jsonschema](https://www.npmjs.com/package/jsonschema)
