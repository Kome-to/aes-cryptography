import { INV_MIX_COLUMN_MATRIX, MIX_COLUMN_MATRIX, NUMBER_OF_ROUNDS, R_CON } from "./constant.mjs";
import utils from "./utils.mjs";

class AES {
    constructor() { }

    // ___________ AES encrypt
    encrypt = (matrix, keyMatrix, keySizeInBits = 128) => {
        this.numberOfRounds = NUMBER_OF_ROUNDS[keySizeInBits];
        this.matrix = matrix;
        this.keyMatrix = keyMatrix;
        this.roundKeys = [this.keyMatrix];

        // Round init (Start)
        this.#addRoundKey()

        // (Number of rounds - 1) rounds
        Array(this.numberOfRounds - 1).fill(null).forEach((_) => {
            this.#keyExpansion();
            this.#subBytes();
            this.#shiftRow();
            this.#mixColumn();
            this.#addRoundKey();
        })

        // Final round (End)
        this.#keyExpansion();
        this.#subBytes();
        this.#shiftRow();
        this.#addRoundKey();

        const _matrix = [...this.matrix.map(m => m.join(''))];
        return _matrix.join('');
    }

    // ___________ AES decrypt
    decrypt = (matrix, keyMatrix, keySizeInBits = 128) => {
        this.numberOfRounds = NUMBER_OF_ROUNDS[keySizeInBits];
        this.matrix = matrix;
        this.keyMatrix = keyMatrix;
        this.roundKeys = [this.keyMatrix];


        // Key expansion 
        Array(this.numberOfRounds).fill(null).forEach(_ => {
            this.#keyExpansion();
        })

        // Round init (Start)
        this.#addRoundKey();
        this.roundKeys.pop();

        // (Number of rounds - 1) rounds
        Array(this.numberOfRounds - 1).fill(null).forEach((_) => {
            this.#shiftRow(true);
            this.#subBytes(true);
            this.#addRoundKey();
            this.roundKeys.pop();
            this.#mixColumn(true);

        })

        // Final round (End)
        this.#shiftRow(true);
        this.#subBytes(true);
        this.#addRoundKey();
        this.roundKeys.pop();

        const _matrix = this.matrix.reduce((a, v) => {
            a.push(...v);
            return a;
        }, []);

        return _matrix.join('');
    }

    // ___________ Round Steps

    // 1 - SubBytes
    #subBytes = (inverse = false) => {
        const hexes = this.matrix.reduce((p, v) => {
            p.push(...v);
            return p;
        }, []);

        const _hexes = hexes.map(hex => utils.sBoxTransform(hex, inverse));
        const _matrix = utils.toMatrix(_hexes);
        this.matrix = _matrix;
    }

    // 2 - ShiftRow
    #shiftRow = (inverse = false) => {
        const m = [...this.matrix];
        const _matrix = utils.invertMatrix(m).map((v, i) => {
            const _v = inverse ? [...v.slice(v.length - i, v.length), ...v.slice(0, v.length - i)] : [...v.slice(i, v.length), ...v.slice(0, i)];
            return _v;
        });
        this.matrix = utils.invertMatrix(_matrix);
    }

    // 3 - MixColumn
    #mixColumn = (inverse = false) => {
        const _matrix = [...this.matrix.map((m, x) => {
            const predefineMatrix = inverse ? INV_MIX_COLUMN_MATRIX : MIX_COLUMN_MATRIX;
            const row = predefineMatrix.map((item) => {
                const total = item.reduce((t, v, i) => {
                    t = utils.hexXOR(t, utils.hexMultiply(m[i], v));
                    return t;
                }, '00')
                return total
            })
            return row;
        })];
        this.matrix = _matrix;
    }

    // 4 - AddRoundKey
    #addRoundKey = () => {

        const key = this.roundKeys[this.roundKeys.length - 1];

        // matrix XOR key 
        const nextMatrix = this.matrix.map((r, i) => r.map((v, rI) => utils.hexXOR(v, key[i][rI])));
        this.matrix = nextMatrix;
    }


    // ___________ Key Expansion
    #keyExpansion = () => {
        const previousRoundKey = this.roundKeys[this.roundKeys.length - 1];
        const [w0, w1, w2, w3] = previousRoundKey;

        // _w3 = g(w3)
        const w3_ = [...this.#g(w3)];

        const _w0 = [...w0.map((v, i) => utils.hexXOR(v, w3_[i]))];
        const _w1 = [...w1.map((v, i) => utils.hexXOR(v, _w0[i]))];
        const _w2 = [...w2.map((v, i) => utils.hexXOR(v, _w1[i]))];
        const _w3 = [...w3.map((v, i) => utils.hexXOR(v, _w2[i]))];

        this.roundKeys.push([_w0, _w1, _w2, _w3]);
    }

    #g = (w) => {
        // STEP 1: [b0, b1, b2, b3] => [b1, b2, b3, b0]
        let b = [...w.slice(1, 4), w[0]]

        // STEP 2: S-box transform
        b = b.map(i => utils.sBoxTransform(i));

        // XOR RCon[round]
        const _w = [utils.hexXOR(b[0], R_CON[this.roundKeys.length - 1]), ...b.slice(1, 4)]
        return _w
    }
}



export default new AES();