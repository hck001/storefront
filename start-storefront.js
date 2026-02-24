const { spawn } = require("child_process");
const child = spawn("yarn", ["start"], {
  cwd: __dirname,
  stdio: "inherit",
  shell: true,
  windowsHide: true,
});
child.on("exit", (code) => process.exit(code));
