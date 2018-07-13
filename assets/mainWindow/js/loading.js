function quitApp() {
  const remote = require('electron').remote;
  const window = remote.getCurrentWindow();

  window.forseCloseApp();
}