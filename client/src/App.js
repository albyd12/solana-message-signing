import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

require("./App.css");
require("@solana/wallet-adapter-react-ui/styles.css");

const App = () => {
  return (
    <Context>
      <Content />
    </Context>
  );
};
export default App;

const Context = ({ children }) => {

  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.

  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Content = () => {
  const { connected, signMessage, publicKey } = useWallet();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (!connected) setStatus(null);
  }, [connected]);

  const toHexString = (buffer) => {
    return buffer.reduce(
      (str, byte) => str + byte.toString(16).padStart(2, "0"),
      ""
    );
  };

  //This should be the mint address of an NFT chosen by the user
  //The server will use this mint address to find the actual holder on the blockchain
  //It can then test it against the signature to verify it
  const data = {
    my_nft: "My Mint Address",
  };

  const sign = async () => {
    if (!connected) return;
    const nonceEncoded = new TextEncoder().encode(btoa(JSON.stringify(data)));
    const signed = await signMessage(nonceEncoded);
    axios({
      method: "post",
      url: "http://localhost:5001/sign",
      data: {
        signature: toHexString(signed),
        publicKey: publicKey,
        data: data,
      },
    })
      .then((res) => {
        setStatus({
          status: "success",
          message: res.data,
        });
      })
      .catch((err) => {
        setStatus({
          status: "error",
          message: err.response.data,
        });
      });
  };
  return (
    <div className="App">
      <div className="wallet-container">
        <h3>Message Signing Example</h3>
        <div className="wallet">
          <WalletMultiButton />
        </div>
      </div>

      <div className="content">
        {connected ? (
          <>
            <h2>Click below to verify!</h2>
            <p>*only succeeds with server specified address* 😎</p>
            <button className="sign-button" onClick={sign}>
              Sign Message
            </button>
            <div
              className={`status ${status && status.status}`}
              onClick={() => setStatus(null)}
            >
              <p>{status && status.message}</p>
            </div>
          </>
        ) : (
          <p>Connect wallet to start 🥰</p>
        )}
      </div>
    </div>
  );
};
