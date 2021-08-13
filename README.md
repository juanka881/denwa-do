# @denwa/do
Javascript based task runner. build and run tasks with javascript
in the same spirit as [Jake](https://www.npmjs.com/package/jake), [Grunt](https://www.npmjs.com/package/grunt). 

Use when package.json `scripts` becomes too scary. 

![GitHub Workflow Status](https://img.shields.io/github/workflow/status/juanka881/denwa-do/master-ci)
![npm (scoped)](https://img.shields.io/npm/v/@denwa/do)

## Installation
```sh
npm install @denwa/do
```

## Usage
create a `do.js` file in project repo root.

```js
// import functions
let { sh, task, execute } = require('@denwa/do');

// register hello task
task('hello', () => {
	sh('echo hello friend!');
});

// parse arguments and execute tasks
execute();
```

execute `hello` task with following command
```sh
$ node do hello
hello friend!
```

## API
### `sh`
execute a shell command, works the same as child_process.execSync
except that it catches an exit code of 130 and exits 
the current process. 

```ts
function sh(command: string | string[], options: ExecSyncOptions): void
```

### `task`
register a task callback to be executed, the callback can be sync or async 
and takes a [minimist](https://www.npmjs.com/package/minimist) `ParsedArgs` object

```ts
function task(name: string, callback: (args?: ParsedArgs) => void | Promise<void>): void
```

### `execute`
executes the tasks register by parsing the command line arguments
and invoking the requested task names

```ts
async function execute(args?: string[]): Promise<number>
```

## Command Line 
```sh
node <script> <tasks> <options?>
```

where 

| Parameter | Description                                                    |
| --------- | -------------------------------------------------------------- |
| script    | name of script file to execute, see `do.js` example in `Usage` |
| tasks     | one of more space separate task names to execute               |
| options   | task specific options                                          |