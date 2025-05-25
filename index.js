const express = require('express');
const { Command } = require('commander');
const fs = require('fs');
const path = require('path');

const program = new Command();
program
  .requiredOption('-h, --host <host>', 'Server host')
  .requiredOption('-p, --port <port>', 'Server port')
  .requiredOption('-c, --cache <cacheDir>', 'Cache directory')
  .parse(process.argv);

const { host, port, cache: cacheDir } = program.opts();

if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

const app = express();
app.use(express.json());

app.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}`);
});
