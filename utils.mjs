import { INV_S_BOX, S_BOX } from "./constant.mjs";

class Utils {
    constructor() { }

    toPlainText = (hex) => {
        let str = '';
        hex.forEach(i => {
            const decimalValue = parseInt(i, 16);
            const asciiCharacter = String.fromCharCode(decimalValue);
            str += asciiCharacter;
        });
        return str;
    }

    toHexString = (matrix) => {
        const _matrix = matrix.reduce((a, v) => {
            a.push(...v);
            return a;
        }, []).join('');
        return _matrix;
    }

    transformHex = (str) => {
        const result = [];
        for (let i = 0; i < str.length; i += 2) {
            result.push(str.slice(i, i + 2));
        }
        return result;
    }

    toMatrix = (arr) => {
        const matrix = arr.reduce((p, v, i) => {
            p[Math.floor(i / 4)].push(v);
            return [...p];
        }, [[], [], [], []]);
        return matrix;
    }

    toMatrixes = (arr) => {
        const matrixes = arr.reduce((m, v) => {
            if (!m.length) {
                m = [[[v]]]
                return m;
            }
            const lastMatrix = m[m.length - 1];
            const lastRow = lastMatrix[lastMatrix.length - 1];
            if (lastRow.length < 4) {
                m = [...m.slice(0, m.length - 1), [...lastMatrix.slice(0, lastMatrix.length - 1), [...lastRow, v]]]
            } else if (lastMatrix.length < 4) {
                m = [...m.slice(0, m.length - 1), [...lastMatrix, [v]]]
            } else {
                m = [...m, [[v]]]
            }
            return m;
        }, []);
        return [...matrixes];
    }


    invertMatrix = (matrix) => {
        const _matrix = matrix.map((_, i) => {
            const col = [...matrix.map((v) => v[i])];
            return col;
        })
        return _matrix
    }

    toHex = (text) => {
        let hexScheme = '';
        for (let i = 0; i < text.length; i++) {
            const hex = text.charCodeAt(i).toString(16);

            hexScheme += hex.padStart(2, '0');
        }
        return hexScheme;
    }

    toBlock = (text) => {
        const hexes = [];
        for (let i = 0; i < text.length; i++) {
            const hex = text.charCodeAt(i).toString(16);

            hexes.push(hex.padStart(2, '0'));
        }

        const block = [...this.toMatrix(hexes)];
        return block;
    }

    hexTo = (hex, radix = 10) => {
        const dec = parseInt(hex, 16);
        if (radix === 2) return dec.toString(2).padStart(4, '0');
        return dec;
    }

    binTo = (bin, radix = 10) => {
        const dec = parseInt(bin, 2);
        if (radix === 16) return dec.toString(16).padStart(2, '0');
    }


    sBoxTransform = (hex, inverse = false) => {
        const [x, y] = hex.split('').map(h => this.hexTo(h));
        return inverse ? INV_S_BOX[x][y] : S_BOX[x][y];
    }

    hexXOR = (hex1, hex2) => {
        const decimal1 = parseInt(hex1, 16);
        const decimal2 = parseInt(hex2, 16);
        const resultDecimal = decimal1 ^ decimal2;
        const resultHex = resultDecimal.toString(16);
        return resultHex.padStart(2, '0');
    }

    hexXORMatrix = (matrix1, matrix2) => {
        return matrix1.map((r, i) => r.map((v, rI) => this.hexXOR(v, matrix2[i][rI])));
    }

    hexMultiply = (hex1, hex2) => {
        let a = parseInt(hex1, 16);
        let b = parseInt(hex2, 16);
        let p = 0;

        for (let counter = 0; counter < 8; counter++) {
            if ((b & 1) !== 0) {
                p ^= a;
            }
            const hiBitSet = (a & 0x80) !== 0;
            a = (a << 1) & 0xFF;
            if (hiBitSet) {
                a ^= 0x1B; // AES polynomial x^8 + x^4 + x^3 + x + 1
            }
            b >>= 1;
        }

        return p.toString(16).padStart(2, '0');
    }

    padding = (hexScheme, option = 'PKCS7 Padding') => {
        // Size: 16 bytes
        const size = 16;

        switch (option) {
            case "PKCS7 Padding":
                {
                    const padSize = (size - (hexScheme.length / 2) % size);
                    const hex = padSize.toString(16).padStart(2, '0');
                    return hexScheme.padEnd(hexScheme.length + padSize * 2, hex);
                };
            case "Zero Padding":
                {
                    const padSize = (size - (hexScheme.length / 2) % size);
                    const hex = padSize.toString(16);
                    return `${hexScheme}${hex}`.padEnd(hexScheme.length + padSize * 2, '0');
                }
            default:
                return;
        }
    }

    unPadding = (hexScheme, option = 'PKCS7 Padding') => {
        switch (option) {
            case 'PKCS7 Padding': {
                const paddingLength = parseInt(hexScheme.substring(hexScheme.length - 2, hexScheme.length), 16);
                if (paddingLength < 1 || paddingLength > 16) {
                    return hexScheme;
                }

                for (let i = 1; i <= paddingLength; i++) {
                    if (parseInt(hexScheme.substring(hexScheme.length - 2 * i, hexScheme.length - 2 * i + 2), 16) !== paddingLength) {
                        return hexScheme;
                    }
                }
                return hexScheme.slice(0, hexScheme.length - paddingLength * 2);
            }
            case 'Zero Padding': {
            }
            default:
                return;
        }
    }

}

export default new Utils();