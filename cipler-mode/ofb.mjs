import aes from "../aes.mjs";
import utils from "../utils.mjs";

export class OFB {
    constructor() { }

    encrypt = (plainText, key, keySizeInBits = 128, iv = '') => {
        const hexScheme = utils.padding(utils.toHex(plainText));
        const hexArray = utils.transformHex(hexScheme);
        const keyMatrix = utils.toBlock(key);
        const _iv = utils.toBlock(iv);

        const matrixes = utils.toMatrixes(hexArray);

        const cipherTexts = [];
        const temp = [];
        matrixes.forEach((matrix, index) => {
            let en;
            if (index === 0) {
                en = aes.encrypt(_iv, keyMatrix, keySizeInBits);
            } else {
                const lastTemp = temp[temp.length - 1];
                en = aes.encrypt(lastTemp, keyMatrix, keySizeInBits);
            }
            const _en = utils.toMatrix(utils.transformHex(en));
            const xor = utils.hexXORMatrix(matrix, _en);
            temp.push(_en);
            cipherTexts.push(utils.toHexString(xor));
        })
        return cipherTexts.join('');
    }

    decrypt = (cipherText, key, keySizeInBits = 128, iv = '') => {
        const hexArray = utils.transformHex(cipherText);
        const keyMatrix = utils.toBlock(key);
        const _iv = utils.toBlock(iv);

        const matrixes = utils.toMatrixes(hexArray);

        const plainTexts = [];
        const temp = [];
        matrixes.forEach((matrix, index) => {
            let en;
            if (index === 0) {
                en = aes.encrypt(_iv, keyMatrix, keySizeInBits);
            } else {
                const lastTemp = temp[temp.length - 1];
                en = aes.encrypt(lastTemp, keyMatrix, keySizeInBits);
            }
            const _en = utils.toMatrix(utils.transformHex(en));
            const xor = utils.hexXORMatrix(matrix, _en);
            temp.push(_en);
            plainTexts.push(utils.toHexString(xor));
        });
        const _plainTexts = utils.unPadding(plainTexts.join(''));
        return utils.toPlainText(utils.transformHex(_plainTexts));
    }
}