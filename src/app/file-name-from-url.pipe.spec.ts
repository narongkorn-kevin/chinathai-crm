import { FileNameFromUrlPipe } from './file-name-from-url.pipe';

describe('FileNameFromUrlPipe', () => {
  it('create an instance', () => {
    const pipe = new FileNameFromUrlPipe();
    expect(pipe).toBeTruthy();
  });
});
