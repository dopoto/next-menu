import { getValidLocationId, getValidLocationIdOrThrow } from './location-utils';
import { AppError } from '~/lib/error-utils.server';

describe('location-utils', () => {
    describe('getValidLocationId', () => {
        it('should return null when no candidate is provided', () => {
            expect(getValidLocationId()).toBeNull();
        });

        it('should return null when candidate is empty string', () => {
            expect(getValidLocationId('')).toBeNull();
        });

        it('should return null when candidate is invalid', () => {
            expect(getValidLocationId('invalid-location-id')).toBeNull();
            expect(getValidLocationId('abc')).toBeNull();
            expect(getValidLocationId('!@#$')).toBeNull();
            expect(getValidLocationId('0')).toBeNull();
            expect(getValidLocationId('-1')).toBeNull();
            expect(getValidLocationId('1.5')).toBeNull();
        });

        it('should return the parsed location ID when candidate is a valid integer passed as string', () => {
            const validLocationId = '123';
            const result = getValidLocationId(validLocationId);
            expect(result).toBe(123);
        });

        it('should return the parsed location ID when candidate is a valid integer ', () => {
            const validLocationId = 123;
            const result = getValidLocationId(validLocationId);
            expect(result).toBe(123);
        });
    });

    describe('getValidLocationIdOrThrow', () => {
        it('should throw AppError when no candidate is provided', () => {
            expect(() => getValidLocationIdOrThrow()).toThrow(AppError);
        });

        it('should throw AppError when candidate is empty string', () => {
            expect(() => getValidLocationIdOrThrow('')).toThrow(AppError);
        });

        it('should throw AppError when candidate is invalid', () => {
            expect(() => getValidLocationIdOrThrow('invalid-location-id')).toThrow(AppError);
            expect(() => getValidLocationIdOrThrow('abc')).toThrow(AppError);
            expect(() => getValidLocationIdOrThrow('!@#$')).toThrow(AppError);
            expect(() => getValidLocationIdOrThrow('0')).toThrow(AppError);
            expect(() => getValidLocationIdOrThrow('-1')).toThrow(AppError);
            expect(() => getValidLocationIdOrThrow('1.5')).toThrow(AppError);
        });

        it('should return the parsed location ID when candidate is a valid integer passed as string', () => {
            const validLocationId = '123';
            const result = getValidLocationIdOrThrow(validLocationId);
            expect(result).toBe(123);
        });

        it('should return the parsed location ID when candidate is a valid integer  ', () => {
            const validLocationId = 123;
            const result = getValidLocationIdOrThrow(validLocationId);
            expect(result).toBe(123);
        });
    });
});
