const vscode = require('vscode');
const path = require('path');
const fs = require('fs');

let screamers = ['screamer.jpg', 'screamer2.jpg', 'screamer_main.jpg'];
let cats = ['cat.png'];

let timerActive = false;
let timerId;

function activate(context) {
  console.log('Extension "vscode-plugin" has been activated');

  const startTimerCommand = vscode.commands.registerCommand('vscode-plugin.startRandomTimer', async () => {
    startRandomTimer(context);
  });

  const toggleTimerCommand = vscode.commands.registerCommand('vscode-plugin.toggleTimer', async () => {
    toggleTimer(context);
  });

  context.subscriptions.push(startTimerCommand, toggleTimerCommand);
  startRandomTimer(context);
}

function startRandomTimer(context) {
  if (!timerActive) return;

  const randomTime = Math.floor(Math.random() * 10) + 1;

  timerId = setTimeout(async () => {
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      const diagnostics = vscode.languages.getDiagnostics(activeEditor.document.uri);
      const hasErrors = diagnostics.some(diagnostic => diagnostic.severity === vscode.DiagnosticSeverity.Error);

      const extensionPath = context.extensionPath;
      const imageDir = path.join(extensionPath, 'images');
      const imageFile = hasErrors ? screamers[Math.floor(Math.random() * screamers.length)] : cats[Math.floor(Math.random() * cats.length)];
      const imagePath = path.join(imageDir, imageFile);

      if (!fs.existsSync(imagePath)) {
        vscode.window.showErrorMessage(`Image not found: ${imagePath}`);
        return;
      }

      const imageUri = vscode.Uri.file(imagePath);
      await vscode.commands.executeCommand('vscode.open', imageUri);

      const soundDir = path.join(extensionPath, 'sounds');
      const soundFile = hasErrors ? 'scream.wav' : 'meow.mp3';
      const soundPath = path.join(soundDir, soundFile);
      if (fs.existsSync(soundPath)) {
        playSound(soundPath);
      }
    }

    startRandomTimer(context);
  }, randomTime * 1000);
}

function toggleTimer(context) {
  if (timerActive) {
    stopTimer();
    vscode.window.showInformationMessage('Timer stopped.');
  } else {
    startTimer(context);
    vscode.window.showInformationMessage('Timer started.');
  }
}

function startTimer(context) {
  timerActive = true;
  startRandomTimer(context);
}

function stopTimer() {
  timerActive = false;
  if (timerId) {
    clearTimeout(timerId);
    timerId = null;
  }
}

function playSound(soundPath) {
  const player = require('node-wav-player/lib/wav-player');
  player.play({
    path: soundPath,
  }).then(() => {
    console.log('The sound has finished playing.');
  }).catch(error => {
    console.error(error);
  });
}

function deactivate() {
  stopTimer();
}

module.exports = {
  activate,
  deactivate
};
