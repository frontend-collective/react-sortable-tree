import {
    getParentPathFromOffset,
} from './drag-and-drop-utils';

describe('getParentPathFromOffset', () => {
    it('should handle same-size path', () => {
        expect(getParentPathFromOffset([1, 2], 2, -999, 10)).toEqual([]);
        expect(getParentPathFromOffset([1, 2], 2,  -16, 10)).toEqual([]);
        expect(getParentPathFromOffset([1, 2], 2,   -6, 10)).toEqual([1]);
        expect(getParentPathFromOffset([1, 2], 2,    0, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2], 2,    1, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2], 2,    6, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2], 2,   16, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2], 2,  999, 10)).toEqual([1, 2]);
    });

    it('should handle longer targetPath', () => {
        expect(getParentPathFromOffset([1, 2, 3], 2, -999, 10)).toEqual([]);
        expect(getParentPathFromOffset([1, 2, 3], 2,  -16, 10)).toEqual([]);
        expect(getParentPathFromOffset([1, 2, 3], 2,   -6, 10)).toEqual([1]);
        expect(getParentPathFromOffset([1, 2, 3], 2,    0, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2, 3], 2,    1, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2, 3], 2,    6, 10)).toEqual([1, 2, 3]);
        expect(getParentPathFromOffset([1, 2, 3], 2,   16, 10)).toEqual([1, 2, 3]);
        expect(getParentPathFromOffset([1, 2, 3], 2,  999, 10)).toEqual([1, 2, 3]);
    });

    it('should handle longer sourcePath', () => {
        expect(getParentPathFromOffset([1, 2], 3, -999, 10)).toEqual([]);
        expect(getParentPathFromOffset([1, 2], 3,  -16, 10)).toEqual([1]);
        expect(getParentPathFromOffset([1, 2], 3,   -6, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2], 3,    0, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2], 3,    1, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2], 3,    6, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2], 3,   16, 10)).toEqual([1, 2]);
        expect(getParentPathFromOffset([1, 2], 3,  999, 10)).toEqual([1, 2]);
    });
});
