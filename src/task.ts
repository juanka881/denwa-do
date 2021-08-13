import minimist from 'minimist';

/**
 * task callback type, can return void or a promise
 * and take a ParsedArgs type
 */
export type TaskCallback = (args?: minimist.ParsedArgs) => void | Promise<void>;

/**
 * global task registry
 */
let taskRegistry = new Map<string, TaskCallback>();

/**
 * clear all tasks in the registry
 */
export function clearTasks(): void {
    taskRegistry.clear();
}

/**
 * add task to registry
 * @param name task name
 * @param callback task callback
 */
export function task(name: string, callback: TaskCallback): void {
    taskRegistry.set(name, callback);
}

/**
 * invoke a task by name, passing the given ParsedArgs
 * @param name task name
 * @param args task arguments
 */
export async function invoke(name: string, args?: minimist.ParsedArgs): Promise<void>  {
    const callback = taskRegistry.get(name);
    if(!callback) {
        throw new Error('not found');
    }

    const result = Promise.resolve(callback(args));
    await result;
}

/**
 * execute tasks using the args provided, 
 * if args is not passed, then read the args from process.argv
 * and exit after the tasks are executed
 * @param args the command line arguments to parsed for task and options
 * @returns a promise with the exit code, 0 = ok, -1 = unknown error, otherwise error.code 
 */
export async function execute(args?: string[]): Promise<number> {
    if(args === undefined) {
        const args = process.argv.slice(2);
        execute(args).then(code => process.exit(code));
    }

    if(Object.keys(taskRegistry).length === 0) {
        console.log('no tasks registered');
        return 1;
    }

    const taskArgs = minimist(args);
    let names = taskArgs._ || [];

    if(names.length === 0) {
        names = ['default']
    }

    let current = '';
    try {
        for(const name of names) {
            current = name;
            await invoke(name, taskArgs);
        }

    }
    catch(error) {
        console.log(`task [${current}] error: ${error.message}`);
        return error.code ?? -1;
    }

    return 0;
}