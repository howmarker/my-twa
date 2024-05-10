import { mnemonicNew, mnemonicToPrivateKey } from "@ton/crypto";
import { TonClient, WalletContractV4 } from "@ton/ton";
import {
  useTonConnectModal,
  useTonAddress,
  useTonConnectUI,
  useTonWallet,
  TonConnectButton,
} from "@tonconnect/ui-react";
import { useMemo, useState } from "react";
import { useCounterContract } from "./hooks/useCounterContract";
import { useTonConnect } from "./hooks/useTonConnect";

const transaction: any = {
  messages: [
    {
      address: "UQAhKqciPn5FwrsRjgk_yH6AeD-9vbtBkTtxv1h-1GR-v_hi",
      amount: "0.05",
    },
  ],
};

// Create Client
const client = new TonClient({
  endpoint: "https://toncenter.com/api/v2/jsonRPC",
});

const mnemonics = await mnemonicNew();
const keyPair = await mnemonicToPrivateKey(mnemonics);
const workchain = 0; // Usually you need a workchain 0
const wallet = WalletContractV4.create({
  workchain,
  publicKey: keyPair.publicKey,
});
const contract = client.open(wallet);
const balance: bigint = await contract.getBalance();

// Get balance

function App() {
  const { open } = useTonConnectModal();

  const [tonConnectUI] = useTonConnectUI();
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();

  return (
    // <div className="App">
    //   <div className="Container">
    //     {!address ? (
    //       <button onClick={open}>Connect Wallet</button>
    //     ) : (
    //       <>
    //         <button onClick={() => tonConnectUI.sendTransaction(transaction)}>
    //           Send transaction
    //         </button>
    //         <button onClick={() => tonConnectUI.disconnect()}>
    //           Disconnect
    //         </button>
    //         <p>{address}</p>
    //       </>
    //     )}
    //   </div>
    // </div>
    <div className="App">
      <div className="Container">
        <TonConnectButton />

        <div className="Card">
          <b>Counter Address</b>
          <div className="Hint">{address?.slice(0, 30) + "..."}</div>
        </div>

        <div className="Card">
          <b>Counter Value</b>
          <div>{value ?? "Loading..."}</div>
        </div>

        <a
          className={`Button ${connected ? "Active" : "Disabled"}`}
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      </div>
    </div>
  );
}

export default App;
