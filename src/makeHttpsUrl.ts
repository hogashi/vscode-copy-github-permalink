export const makeHttpsUrl = (inputUrl: string) =>
  inputUrl.replace(
    /^(?:[^:]+:\/\/|)(?:git@|)([^:\/]+)[:\/](.+?)(?:\.git|)$/,
    'https://$1/$2',
  );
