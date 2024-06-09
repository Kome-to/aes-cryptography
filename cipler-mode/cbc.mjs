import aes from "../aes.mjs";
import utils from "../utils.mjs";

export class CBC {
    constructor() { }

    encrypt = (plainText, key, keySizeInBits = 128, iv = '') => {

        const hexScheme = utils.padding(utils.toHex(plainText));
        const hexArray = utils.transformHex(hexScheme);
        const keyMatrix = utils.toBlock(key);

        const matrixes = utils.toMatrixes(hexArray);

        const cipherTexts = [];
        matrixes.forEach((matrix) => {
            if (!cipherTexts.length) {
                const _iv = utils.toBlock(iv);
                const _matrix = utils.hexXORMatrix(matrix, _iv);
                const cipherText = aes.encrypt(_matrix, keyMatrix, keySizeInBits);
                cipherTexts.push(cipherText);
                return;
            }
            const lastCipher = cipherTexts[cipherTexts.length - 1];
            const _lastCipher = utils.toMatrix(utils.transformHex(lastCipher))
            const _matrix = utils.hexXORMatrix(matrix, _lastCipher);

            const cipherText = aes.encrypt(_matrix, keyMatrix, keySizeInBits);
            cipherTexts.push(cipherText);
        })
        return cipherTexts.join('');
    }

    decrypt = (cipherText, key, keySizeInBits = 128, iv = '') => {
        const hexArray = utils.transformHex(cipherText);
        const keyMatrix = utils.toBlock(key);

        const matrixes = utils.toMatrixes(hexArray);

        const plainTexts = [];

        for (let index = 0; index < matrixes.length; index++) {
            const de = aes.decrypt(matrixes[index], keyMatrix, keySizeInBits);
            const deMatrix = utils.toMatrix(utils.transformHex(de));
            if (index === 0) {
                const _iv = utils.toBlock(iv);
                const plainTextMatrix = utils.hexXORMatrix(deMatrix, _iv)
                const plainText = utils.toHexString(plainTextMatrix);
                plainTexts.push(plainText);
                continue;
            }
            const plainTextMatrix = utils.hexXORMatrix(deMatrix, matrixes[index - 1]);
            const plainText = utils.toHexString(plainTextMatrix)
            plainTexts.push(plainText);
        }

        const _plainTexts = utils.unPadding(plainTexts.join(''));
        return utils.toPlainText(utils.transformHex(_plainTexts));
    }
}