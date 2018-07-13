const devlog = (msg) => {
  const mainWindow = window.require('electron').remote.getCurrentWindow();

  if (mainWindow.appConfig.dev) {
    console.warn(msg);
  }
}

export default devlog;