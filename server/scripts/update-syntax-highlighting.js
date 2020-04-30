const fs = require('fs');
const process = require('process');
const request = require('request');

request('https://p5js.org/reference/data.json', (err, res) => {
  if (!err) {
    const result = res.toJSON();
    const data = JSON.parse(result.body);

    const arr = data.classitems;
    const p5VariableKeywords = {};
    const p5FunctionKeywords = {};

    arr.forEach((obj) => {
      if (obj.class === 'p5' && obj.module !== 'Foundation') {
        if (obj.itemtype === 'property') {
          p5VariableKeywords[`${obj.name}`] = 'p5Variable';
        }
        if (obj.itemtype === 'method') {
          p5FunctionKeywords[`${obj.name}`] = 'p5Function';
        }
      }
    });

    let p5VariablePart = JSON.stringify(p5VariableKeywords);
    let p5FunctionPart = JSON.stringify(p5FunctionKeywords);
    p5VariablePart = p5VariablePart.replace(/"p5Variable"/g, 'p5Variable');
    p5FunctionPart = p5FunctionPart.replace(/"p5Function"/g, 'p5Function');

    let generatedCode = '/*eslint-disable*/ \n';
    generatedCode += 'var p5Function = {type: "variable", style: "p5-function"};\n';
    generatedCode += 'var p5Variable = {type: "variable", style: "p5-variable"};\n';
    generatedCode += `let p5VariableKeywords = ${p5VariablePart}; \n`;
    generatedCode += `let p5FunctionKeywords = ${p5FunctionPart}; \n`;
    generatedCode += 'exports.p5FunctionKeywords = p5FunctionKeywords;\n';
    generatedCode += 'exports.p5VariableKeywords = p5VariableKeywords;\n';
    fs.writeFile(`${process.cwd()}/client/utils/p5-javascript-template.js`, generatedCode, (error) => {
      if (error) {
        console.log("Error!! Couldn't write to the file", error);
      } else {
        console.log('Syntax highlighting files updated successfully');
      }
    });
  } else {
    console.log("Error!! Couldn't fetch the data.json file");
  }
});
