import { spawn } from 'node:child_process';

type Options = {
  dataCallback?: (data: string) => void;
  inheritStdio?: boolean;
  cwd?: string;
};

export function promiseExec(command: string, options?: Options) {
  if (options?.dataCallback && options?.inheritStdio) {
    throw new Error('Cannot use dataCallback and inheritStdio together');
  }
  const commandAndArgs = command.split(' ');
  const cmd = commandAndArgs[0];
  const args = commandAndArgs.slice(1);

  return new Promise<void>((resolve, reject) => {
    console.log('executing: ', command);
    const child = spawn(cmd, args, {
      stdio: options?.inheritStdio ? 'inherit' : 'pipe',
      shell: true,
      cwd: options?.cwd || process.cwd(),
      env: { ...process.env, FORCE_COLOR: 'true' },
    });
    if (!options?.inheritStdio) {
      child.stdout?.pipe(process.stdout);
      child.stderr?.pipe(process.stderr);
      if (options?.dataCallback) {
        child.stdout?.on('data', options?.dataCallback);
      }
    }
    child.on('exit', code => (code === 0 ? resolve() : reject(code)));
    child.on('error', error => reject(error));
  });
}
