import aes from "../aes.mjs";
import utils from "../utils.mjs"

export class ECB {
    constructor() { }

    encrypt = (plainText, key, keySizeInBits = 128) => {
        const hexScheme = utils.padding(utils.toHex(plainText));
        const hexArray = utils.transformHex(hexScheme);
        const keyMatrix = utils.toBlock(key);

        const matrixes = utils.toMatrixes(hexArray);

        const cipherTexts = [];
        matrixes.forEach((matrix) => {
            const cipherText = aes.encrypt(matrix, keyMatrix, keySizeInBits);
            cipherTexts.push(cipherText);
        })
        return cipherTexts.join('');
    }

    decrypt = (cipherText, key, keySizeInBits = 128) => {
        const hexArray = utils.transformHex(cipherText);
        const keyMatrix = utils.toBlock(key);

        const matrixes = utils.toMatrixes(hexArray);

        const plainTexts = [];
        matrixes.forEach((matrix) => {
            const plainText = aes.decrypt(matrix, keyMatrix, keySizeInBits);

            plainTexts.push(plainText);
        })
        const _plainTexts = utils.unPadding(plainTexts.join(''));
        return utils.toPlainText(utils.transformHex(_plainTexts));
    }
}
