import { execSync, ExecSyncOptions } from 'child_process';

/**
 * execute a shell command, works same as execSync
 * except that an exit code 130 is not considered an error
 * allowing long running tasks like dev servers to exit
 * gracefully via control + c,
 * 
 * when a exit code of 130 is received, process.exit(0)
 * is called to exit the current process
 * 
 * inherits standardOutput and standardError IO from child process into parent 
 * @param command a string or list of strings to join together via space ` `
 * @param options same options as execSync see `ExecSyncOptions`
 */
export function sh(command: string | string[], options: ExecSyncOptions): void {
	let finalCommand = '';

	if (Array.isArray(command)) {
		command = command ?? [];
		finalCommand = command.join(' ');
	}
	else {
		finalCommand = command ?? '';
	}

	const finalOptinos: ExecSyncOptions = {
		stdio: 'inherit',
		...options,
	};

	try {
		execSync(finalCommand, finalOptinos);
	}
	catch (error) {
		if (error.code === 130) {
			process.exit(0);
		}
		else {
			throw error;
		}
	}
}
