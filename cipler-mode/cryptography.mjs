import { CBC } from "./cbc.mjs";
import { ECB } from "./ecb.mjs";
import { OFB } from "./ofb.mjs";

class Cryptography {
    cbc = new CBC();
    ecb = new ECB();
    ofb = new OFB();

    constructor() { }
}

export default new Cryptography();