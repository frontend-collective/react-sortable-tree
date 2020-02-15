import { slideRows } from './generic-utils';

describe('slideRows', () => {
  it('should handle empty slide', () => {
    expect(slideRows([0, 1, 2], 1, 2, 0)).toEqual([0, 1, 2]);
    expect(slideRows([0, 1, 2], 1, 0, 0)).toEqual([0, 1, 2]);
    expect(slideRows([0, 1, 2], 1, 1, 0)).toEqual([0, 1, 2]);
  });

  it('should handle single slides', () => {
    expect(slideRows([0, 1, 2], 1, 1, 1)).toEqual([0, 1, 2]);
    expect(slideRows([0, 1, 2], 1, 2, 1)).toEqual([0, 2, 1]);
    expect(slideRows([0, 1, 2], 1, 0, 1)).toEqual([1, 0, 2]);
    expect(slideRows([0, 1, 2], 0, 2, 1)).toEqual([1, 2, 0]);
  });

  it('should handle multi slides', () => {
    expect(slideRows([0, 1, 2], 1, 0, 2)).toEqual([1, 2, 0]);
    expect(slideRows([0, 1, 2, 3], 0, 2, 2)).toEqual([2, 3, 0, 1]);
    expect(slideRows([0, 1, 2, 3], 3, 0, 2)).toEqual([3, 0, 1, 2]);
  });
});
