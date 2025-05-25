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
const multer = require('multer');
const upload = multer();
const NOTES_PATH = cacheDir;

const getNotePath = name => path.join(NOTES_PATH, name + '.txt');

app.get('/notes/:name', (req, res) => {
  const filePath = getNotePath(req.params.name);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);
  const text = fs.readFileSync(filePath, 'utf-8');
  res.send(text);
});

app.put('/notes/:name', express.text(), (req, res) => {
  const filePath = getNotePath(req.params.name);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);
  fs.writeFileSync(filePath, req.body);
  res.sendStatus(200);
});

app.delete('/notes/:name', (req, res) => {
  const filePath = getNotePath(req.params.name);
  if (!fs.existsSync(filePath)) return res.sendStatus(404);
  fs.unlinkSync(filePath);
  res.sendStatus(200);
});

app.get('/notes', (req, res) => {
  const files = fs.readdirSync(NOTES_PATH).filter(f => f.endsWith('.txt'));
  const notes = files.map(f => ({
    name: path.basename(f, '.txt'),
    text: fs.readFileSync(path.join(NOTES_PATH, f), 'utf-8')
  }));
  res.status(200).json(notes);
});

app.post('/write', upload.none(), (req, res) => {
  const { note_name, note } = req.body;
  const filePath = getNotePath(note_name);
  if (fs.existsSync(filePath)) return res.sendStatus(400);
  fs.writeFileSync(filePath, note);
  res.sendStatus(201);
});

app.get('/UploadForm.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'UploadForm.html'));
});
