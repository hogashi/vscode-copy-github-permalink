import { makeHttpsUrl } from '../makeHttpsUrl';

const expected = 'https://repo.example.test/hoge/fuga-foo';

describe('url maker', () => {
  describe('https', () => {
    const scheme = 'https://';
    const dummyRepo = 'repo.example.test:hoge/fuga-foo';
    describe('git user', () => {
      const user = 'git@';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
    describe('no user', () => {
      const user = '';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
  });
  describe('ssh', () => {
    const scheme = 'ssh://';
    const dummyRepo = 'repo.example.test:hoge/fuga-foo';
    describe('git user', () => {
      const user = 'git@';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
    describe('no user', () => {
      const user = '';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
  });
  describe('git', () => {
    const scheme = 'git://';
    const dummyRepo = 'repo.example.test:hoge/fuga-foo';
    describe('git user', () => {
      const user = 'git@';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
    describe('no user', () => {
      const user = '';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
  });
  describe('no scheme', () => {
    const scheme = '';
    const dummyRepo = 'repo.example.test:hoge/fuga-foo';
    describe('git user', () => {
      const user = 'git@';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
    describe('no user', () => {
      const user = '';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
  });
  describe('git ssh', () => {
    const scheme = 'git+ssh://';
    const dummyRepo = 'repo.example.test:hoge/fuga-foo';
    describe('git user', () => {
      const user = 'git@';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
    describe('no user', () => {
      const user = '';
      it('within .git', () => {
        const dotgit = '.git';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
      it('without .git', () => {
        const dotgit = '';
        expect(makeHttpsUrl(scheme + user + dummyRepo + dotgit)).toStrictEqual(expected);
      });
    });
  });
});
