const getRandomIntInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min; // the maximum is inclusive and the minimum is inclusive
}

export const getRandomElectrumServer = (servers, excludeServer) => {
  let randomServer;
  let _servers = [];

  for (let i = 0; i < servers.length; i++) {
    if (excludeServer !== servers[i]) {
      _servers.push(servers[i]);
    }
  }

  // pick a random server to communicate with
  if (_servers &&
      _servers.length > 0) {
    const _randomServerId = getRandomIntInclusive(0, _servers.length - 1);
    const _randomServer = _servers[_randomServerId];
    const _serverDetails = _randomServer.split(':');

    if (_serverDetails.length === 2) {
      return {
        ip: _serverDetails[0],
        port: _serverDetails[1],
      };
    }
  } else {
    const _serverDetails = _servers[0].split(':');

    return {
      ip: _serverDetails[0],
      port: _serverDetails[1],
    };
  }
}

export default getRandomElectrumServer;