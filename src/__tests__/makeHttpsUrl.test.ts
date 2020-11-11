import { makeHttpsUrl } from '../makeHttpsUrl';

const testcases = [
  {
    inputs: ['file:///org/repo.git'],
    expected: 'https://org/repo',
  },
  {
    inputs: ['user@hostname.test:repo.git'],
    expected: 'https://hostname.test/repo',
  },
  {
    inputs: [
      'http://user@hostname.test/org/repo.git',
      'https://hostname.test/org/repo',
      'https://user@hostname.test/org/repo.git',
      'https://user:pass@hostname.test/org/repo.git',
      'ssh://hostname.test:22/org/repo',
      'ssh://user@hostname.test/org/repo',
      'user@hostname.test:/org/repo.git',
      'user@hostname.test:org/repo',
      'user@hostname.test:org/repo.git',
    ],
    expected: 'https://hostname.test/org/repo',
  },
];

describe('makeHttpsUrl', () => {
  testcases.forEach(({ inputs, expected }) => {
    inputs.forEach(input => {
      it(input, () => {
        expect(makeHttpsUrl(input)).toStrictEqual(expected);
      });
    });
  });
});
