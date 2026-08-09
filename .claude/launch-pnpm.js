// Cross-platform pnpm launcher for .claude/launch.json
// Works on Windows (where spawn can't resolve .CMD from PATH) and Unix alike.
const { execSync } = require('child_process');
const args = process.argv.slice(2).join(' ');
try {
  execSync(`pnpm ${args}`, { stdio: 'inherit', cwd: process.cwd() });
} catch (e) {
  process.exit(e.status || 1);
}
