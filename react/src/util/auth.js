import { PassPhraseGenerator } from './crypto/passphrasegenerator.js';
import { md5 } from './crypto/md5.js';

let appSessionHash;

try {
  appSessionHash = window.require('electron').remote.getCurrentWindow().appSessionHash;
} catch (e) {
  appSessionHash = '1234';
}

export function iguanaSetRPCAuth() {
  sessionStorage.setItem('IguanaRPCAuth', appSessionHash);
}