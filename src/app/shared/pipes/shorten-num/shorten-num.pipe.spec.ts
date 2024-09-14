import { ShortenNumPipe } from './shorten-num.pipe';

describe('ShortenNumPipe', () => {
  it('create an instance', () => {
    const pipe = new ShortenNumPipe();
    expect(pipe).toBeTruthy();
  });
});
