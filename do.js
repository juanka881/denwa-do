const { task, sh, execute } = require('./dist/src');

task('hello', () => console.log('hello friend!'));

execute();