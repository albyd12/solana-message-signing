## Solana Message Signing

Simple example of using the solana-wallet-adapter to sign a message, then verifying it on the server side.

![1](https://user-images.githubusercontent.com/100741622/157547039-8ec34c95-fb10-42d4-a3c0-a980a8806e96.png | width=100)
![2](https://user-images.githubusercontent.com/100741622/157547056-828368cd-36ee-4179-bb26-a825f1e92dd3.png | width=100)


- Sign message on client
- Send signature to express server
- Verify signature
- Send result to client

-----
##### Setting up the server
```
cd server
npm install
npm run dev
```
----
##### Starting the client
```
cd client
npm install
npm start
```
