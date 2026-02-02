import { test, expect } from '@playwright/test';
import { encryptText, decryptText } from '../../src/utils/encryption';

test.describe('Encryption Utils Unit Tests', () => {
    const secret = 'my-super-secret-key';
    const plainText = 'Hello, this is a secret message!';

    test('should encrypt and decrypt text successfully', async () => {
        const encrypted = encryptText(plainText, secret);
        expect(encrypted).not.toBe(plainText);
        expect(encrypted).toContain(':');

        const decrypted = decryptText(encrypted, secret);
        expect(decrypted).toBe(plainText);
    });

    test('should produce different encrypted output for same text (using random IV)', async () => {
        const enc1 = encryptText(plainText, secret);
        const enc2 = encryptText(plainText, secret);
        expect(enc1).not.toBe(enc2);

        expect(decryptText(enc1, secret)).toBe(plainText);
        expect(decryptText(enc2, secret)).toBe(plainText);
    });

    test('should fail to decrypt with wrong secret', async () => {
        const encrypted = encryptText(plainText, secret);
        const wrongSecret = 'wrong-secret';

        // Decryption with wrong key usually throws an error in Node crypto
        // due to padding mismatch or data corruption
        expect(() => decryptText(encrypted, wrongSecret)).toThrow();
    });

    test('should handle empty strings', async () => {
        const empty = '';
        const encrypted = encryptText(empty, secret);
        const decrypted = decryptText(encrypted, secret);
        expect(decrypted).toBe('');
    });

    test('should throw error for invalid encrypted data format', async () => {
        const invalidData = 'some-random-string-without-colon';
        expect(() => decryptText(invalidData, secret)).toThrow('Invalid encrypted data');
    });

    test('should handle special characters', async () => {
        const special = '!@#$%^&*()_+{}[]|\\;:\'\",.<>?/`~';
        const encrypted = encryptText(special, secret);
        const decrypted = decryptText(encrypted, secret);
        expect(decrypted).toBe(special);
    });
});
