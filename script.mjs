import cryptography from "./cipler-mode/cryptography.mjs";

const encryptBtn = document.getElementById('encrypt-button');
const decryptBtn = document.getElementById('decrypt-button');
const cipherModeElm = document.getElementById('cipher-mode-encrypt');
const paddingElm = document.getElementById('padding-encrypt');
const ivElm = document.getElementById('iv-encrypt');
const keySizeElm = document.getElementById('key-size-encrypt');
const keyElm = document.getElementById('key-encrypt');

cipherModeElm.addEventListener('change', (e) => {
    const elm = document.getElementById('iv-encrypt-field');
    if (e.target.value === 'ecb') {
        elm.style.display = 'none';
    } else {
        elm.style.display = 'block';
    }
})

encryptBtn.addEventListener('click', () => {
    try {
        console.log("ENCRYPT");
        const messageElm = document.getElementById('message-encrypt');
        const outputElm = document.getElementById('output-encrypt');

        const plainText = messageElm.value;

        if (!plainText) {
            alert('Please enter input to encrypt');
            return;
        }

        const cipherMode = cipherModeElm.value;
        const padding = paddingElm.value;
        const iv = ivElm.value;
        const keySize = keySizeElm.value;
        const key = keyElm.value;

        if (key.length !== keySize / 8) {
            alert(`Secret key must have ${keySize} bits in length`);
            return;
        }

        if (cipherMode !== 'ecb' && !iv) {
            alert(`IV is required`);
            return;
        }
        console.log(cipherMode);
        const cipher = cryptography[cipherMode].encrypt(plainText, key, keySize, iv);

        outputElm.value = cipher;
    } catch (e) {
        console.log(e);
        alert("Invalid input")
    }

})

decryptBtn.addEventListener('click', () => {
    try {
        console.log("DECRYPT");
        const messageElm = document.getElementById('message-decrypt');
        const outputElm = document.getElementById('output-decrypt');



        const cipherText = messageElm.value;

        if (!cipherText) {
            alert('Please enter input to decrypt');
            return;
        }

        if (cipherText.length % 32 !== 0) {
            alert('Please enter hex string with valid length to decrypt');
            return;
        }


        if (!/^[0-9a-fA-F]+$/.test(cipherText)) {
            alert('Please enter a valid hex string to decrypt');
            return;
        }




        const cipherMode = cipherModeElm.value;
        const padding = paddingElm.value;
        const iv = ivElm.value;
        const keySize = keySizeElm.value;
        const key = keyElm.value;

        if (key.length !== keySize / 8) {
            alert(`Secret key must have ${keySize} bits in length`);
            return;
        }

        const plainText = cryptography[cipherMode].decrypt(cipherText, key, keySize, iv);

        outputElm.value = plainText;
    } catch (e) {
        console.log(e);
        alert("Invalid input")
    }

})