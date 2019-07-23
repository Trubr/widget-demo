const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const VirgilCrypto = require('virgil-crypto'); 

const keyPair = {
  publicKey: "LS0tLS1CRUdJTiBQVUJMSUMgS0VZLS0tLS0KTUZZd0VBWUhLb1pJemowQ0FRWUZLNEVFQUFvRFFnQUVUeFhVQUYxeFRaWFNCaGNCYTNoelVvSFZPR0ozQTFybwpNOVFyYmRRa2UvUTcyMis4WlhqSi81RHluSHRtRUZ5a1VRNlY0Z2RONzdFanFlRS82UGJ4Wnc9PQotLS0tLUVORCBQVUJMSUMgS0VZLS0tLS0=",
  privateKey: "LS0tLS1CRUdJTiBFQyBQUklWQVRFIEtFWS0tLS0tCk1IUUNBUUVFSUFubGU5dEdzNGw2ZDcxYmdmaUtNY3BvNklpN3BPdTdiVW5KNFJzeE1NaUxvQWNHQlN1QkJBQUsKb1VRRFFnQUVUeFhVQUYxeFRaWFNCaGNCYTNoelVvSFZPR0ozQTFyb005UXJiZFFrZS9RNzIyKzhaWGpKLzVEeQpuSHRtRUZ5a1VRNlY0Z2RONzdFanFlRS82UGJ4Wnc9PQotLS0tLUVORCBFQyBQUklWQVRFIEtFWS0tLS0t"
};

app.use(bodyParser.json());
app.use('/', express.static('app/public'));

const loadPrivateKeyContent = () => {
  const base64Pem = keyPair.privateKey;
  const buff = new Buffer(base64Pem, 'base64');
  const decryptedPem = buff.toString('ascii');

  const pemParts = decryptedPem.split("\n");
  const pemContent = pemParts
    .filter(part => !part.startsWith("-----BEGIN") && !part.startsWith("-----END"))
    .join("");

  return pemContent;
}

const decryptMessage = (encryptedMessage) => {
  const virgilCrypto = new VirgilCrypto.VirgilCrypto();
  const privateKeyContent = loadPrivateKeyContent(virgilCrypto);
  const privateKey = virgilCrypto.importPrivateKey(privateKeyContent);
  return virgilCrypto.decrypt(encryptedMessage, privateKey);
}

app.post('/api/decrypt', (req, res) => {
  const body = req.body;
  const data = decryptMessage(body.data).toString('ascii');
  res.status(202).send(data);
});

app.listen(3000);
