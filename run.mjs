import { CBC } from "./cipler-mode/cbc.mjs";
import { ECB } from "./cipler-mode/ecb.mjs";

const KEY = "Thats my Kung Fu";

const ecb = new ECB();
const cbc = new CBC();


// // TEST 
// const keySizes = ['128']

// function generateRandomText(length) {
//     const characters = ' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~';
//     let randomText = '';
//     for (let i = 0; i < length; i++) {
//         randomText += characters.charAt(Math.floor(Math.random() * characters.length));
//     }
//     return randomText;
// }

// let count = 0; // Try 1000 times;

// while (count < 1000000) {
//     count++;
//     console.log("🚀 ~ count:", count)
//     const randomText = generateRandomText(Math.round(Math.random() * 10) * 2);
//     const keySize = keySizes[0];

//     const cipherECB = ecb.encrypt(randomText, KEY, keySize);
//     const textECB = ecb.decrypt(cipherECB, KEY, keySize);

//     if (randomText !== textECB) {
//         console.log('[FAIL]');
//         console.log("🚀 ~ randomText:", randomText)
//         console.log("🚀 ~ cipherECB:", cipherECB)
//         console.log("🚀 ~ textECB:", textECB)
//         console.log("🚀 ~ keySize:", keySize)
//         console.log("🚀 ~ KEY:", KEY)
//         break;
//     }


//     const iv = generateRandomText(Math.round(Math.abs(Math.random() * 10) * 2 - 5) + 1);
//     const cipherCBC = cbc.encrypt(randomText, KEY, iv, keySize);
//     const textCBC = cbc.decrypt(cipherCBC, KEY, iv, keySize);
//     if (randomText !== textCBC) {
//         console.log('[FAIL]');
//         console.log("🚀 ~ randomText:", randomText)
//         console.log("🚀 ~ cipherCBC:", cipherCBC)
//         console.log("🚀 ~ textCBC:", textCBC)
//         console.log("🚀 ~ iv:", iv)
//         console.log("🚀 ~ keySize:", keySize)
//         console.log("🚀 ~ KEY:", KEY)
//         break;
//     }
// }