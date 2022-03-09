const express = require("express");
var cors = require('cors');

const nacl = require("tweetnacl");
const bs58 = require("bs58");

const app = express();

app.use(cors())
app.use(express.json());

const fromHexString = (hexString) => new Uint8Array(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));


app.post('/sign', (req, res) => {
    const signature = req.body.signature;
    const data = req.body.data;

    // in the real world - we would use @solana/web3.js to find the actual holder of this mint
    const expected_owner = 'wYCszwUAvJwDK65Kd6nLhsCVt4HRrRCcdPtFRHZgFMz';

    const signatureUint8 = fromHexString(signature);
    const pubKeyUint8 = bs58.decode(expected_owner);

    const fixed_nonce = {
        my_nft: data.my_nft
    }

    const encodedNonce = new TextEncoder().encode(btoa(JSON.stringify(fixed_nonce)));
    const result = nacl.sign.detached.verify(encodedNonce, signatureUint8, pubKeyUint8);

    console.log('Signature is from owner:', result);

    return result?
    res.status(200).json('WAGMI! You\'re the owner 🚀')
    :
    res.status(401).json('NGMI! You\'re not the owner 😡')

})

app.listen(5001, () => {
    console.log('Live on port 5001!')
})