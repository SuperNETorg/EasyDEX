// obsolete(?)
let Config;
let _config = {
  iguanaCorePort: 7778,
  agamaPort: 17777,
  enableCacheApi: true,
  useBasiliskInstance: true,
  openAlias: false,
  debug: true,
  defaultLang: 'EN',
  cli: {
    passthru: true,
    default: true
  },
  iguanaLessMode: true,
  roundValues: true,
};

try {
  Config = window.require('electron').remote.getCurrentWindow().appConfig;
  Config.token = window.require('electron').remote.getCurrentWindow().appSessionHash;
} catch (e) {
  Config = _config;
}

export default Config;