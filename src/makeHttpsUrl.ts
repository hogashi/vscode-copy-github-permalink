export const makeHttpsUrl = (inputUrl: string) => {
  const result = inputUrl.match(
    //   scheme         username          password    hostname   port                path       suffix
    /^(?:[^:]+:\/\/)?(?:[a-zA-Z0-9_\-]+(?::[^@]+)?@)?([^:/]+)?(?::(?:[0-9]+)?\/?|\/)([^/].*?)(?:\.git)?$/
  );
  if (result === null) {
    return inputUrl;
  }
  const hostname = result[1] === undefined ? '' : `${result[1]}/`;
  const path = result[2];
  return `https://${hostname}${path}`;
};
