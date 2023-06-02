import {stringToPath} from "@cosmjs/crypto";
import {coins} from "@cosmjs/proto-signing";
import {
    assertIsDeliverTxSuccess, calculateFee,
    GasPrice,
    makeMultisignedTx,
    SignerData,
    SigningStargateClient,
} from "@cosmjs/stargate";
import {MsgSendEncodeObject} from "@cosmjs/stargate/build/modules";
import {StargateClient} from "@cosmjs/stargate/build/stargateclient";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {TxRaw} from "cosmjs-types/cosmos/tx/v1beta1/tx";
import {
    createMultisigThresholdPubkey,
    encodeSecp256k1Pubkey,
    Secp256k1HdWallet,
    MultisigThresholdPubkey,
    pubkeyToAddress,
    StdFee
} from "@cosmjs/amino";
import {assert} from "@cosmjs/utils";

const main = (async function () {
    const coreumAccountPrefix = "testcore"; // the address prefix (different for different chains/environments)
    const coreumHDPath = "m/44'/990'/0'/0/0"; // coreum HD path (same for all chains/environments)
    const coreumDenom = "utestcore"; // core denom (different for different chains/environments)
    const coreumRpcEndpoint = "https://full-node-pluto.testnet-1.coreum.dev:26657"; // rpc endpoint (different for different chains/environments)

    const mnemonic1 =
        "fancy limb canoe sentence firm sibling zero rice rug device cactus maze ice life film ecology struggle example congress concert swing power long strike";
    const mnemonic2 =
        "unaware used country milk excess appear equal soft siege ill veteran panel label rhythm once chuckle bomb pool true priority print measure infant dutch";
    const mnemonic3 =
        "speak puzzle behave champion opinion welcome alien large ozone seed enact clog forward finish calm inside size recycle section cousin second general heavy eager";

    const multisigAccountAddress = "testcore1wvpwz0ztetyx0cjxfn9nyq8t5agpvvs0qlxgu4";

    const recipientAddress = "testcore12m9r6zeem9tpvqe29686ddeu9z2ra29j93yyc2";
    const amountToSend = 1000

    // ******************** Multisig ********************

    const signingInstruction = await (async () => {
        const client = await StargateClient.connect(coreumRpcEndpoint);
        const accountOnChain = await client.getAccount(multisigAccountAddress);
        assert(accountOnChain, "Account does not exist on chain");

        const msgSend: MsgSend = {
            fromAddress: multisigAccountAddress,
            toAddress: recipientAddress,
            amount: coins(amountToSend, coreumDenom),
        };
        const msg: MsgSendEncodeObject = {
            typeUrl: "/cosmos.bank.v1beta1.MsgSend",
            value: msgSend,
        };
        const gasLimit = 74000; // the value is static for the single send with 3 signatures
        const gasPrice = GasPrice.fromString(`0.0625${coreumDenom || ""}`);
        const sendFee: StdFee = calculateFee(gasLimit, gasPrice);
        const fee = {
            amount: sendFee.amount,
            gas: gasLimit.toString(),
        };

        return {
            accountNumber: accountOnChain.accountNumber,
            sequence: accountOnChain.sequence,
            chainId: await client.getChainId(),
            msgs: [msg],
            fee: fee,
            memo: "memo",
        };
    })();

    const [
        [pubkey0, signature0, bodyBytes],
        [pubkey1, signature1],
        [pubkey2, signature2],
    ] = await Promise.all(
        [mnemonic1, mnemonic2, mnemonic3].map(async (mnemonic) => {
            // Signing environment
            const wallet = await Secp256k1HdWallet.fromMnemonic(mnemonic, {
                hdPaths: [stringToPath(coreumHDPath)],
            });
            const pubkey = encodeSecp256k1Pubkey((await wallet.getAccounts())[0].pubkey);
            const address = (await wallet.getAccounts())[0].address;
            const signingClient = await SigningStargateClient.offline(wallet);
            const signerData: SignerData = {
                accountNumber: signingInstruction.accountNumber,
                sequence: signingInstruction.sequence,
                chainId: signingInstruction.chainId,
            };
            const {bodyBytes: bb, signatures} = await signingClient.sign(
                address,
                signingInstruction.msgs,
                signingInstruction.fee,
                signingInstruction.memo,
                signerData,
            );
            return [pubkey, signatures[0], bb] as const;
        }),
    );

    // From here on, no private keys are required anymore. Any anonymous entity
    // can collect, assemble and broadcast.
    {
        const multisigPubkey = createMultisigThresholdPubkey(
            [pubkey0, pubkey1, pubkey2],
            2,
        );

        const address0 = pubkeyToAddress(pubkey0, coreumAccountPrefix);
        const address1 = pubkeyToAddress(pubkey1, coreumAccountPrefix);
        const address2 = pubkeyToAddress(pubkey2, coreumAccountPrefix);

        const broadcaster = await StargateClient.connect(coreumRpcEndpoint);
        const signedTx = makeMultisignedTxBytes(
            multisigPubkey,
            signingInstruction.sequence,
            signingInstruction.fee,
            bodyBytes,
            new Map<string, Uint8Array>([
                [address0, signature0],
                [address1, signature1],
                [address2, signature2],
            ]),
        );
        // ensure signature is valid
        const result = await broadcaster.broadcastTx(signedTx);
        assertIsDeliverTxSuccess(result);
    }
})();

export function makeMultisignedTxBytes(
    multisigPubkey: MultisigThresholdPubkey,
    sequence: number,
    fee: StdFee,
    bodyBytes: Uint8Array,
    signatures: Map<string, Uint8Array>,
): Uint8Array {
    const signedTx = makeMultisignedTx(multisigPubkey, sequence, fee, bodyBytes, signatures);
    return Uint8Array.from(TxRaw.encode(signedTx).finish());
}

export default main;
