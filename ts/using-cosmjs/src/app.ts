import {StdFee} from "@cosmjs/amino";
import {stringToPath} from "@cosmjs/crypto";
import {DirectSecp256k1HdWallet, EncodeObject, GeneratedType, Registry} from "@cosmjs/proto-signing";
import {Decimal} from "@cosmjs/math";
import {
    calculateFee,
    createProtobufRpcClient, decodeCosmosSdkDecFromProto,
    GasPrice,
    SigningStargateClient,
} from "@cosmjs/stargate";
import {MsgDelegateEncodeObject, setupStakingExtension} from "@cosmjs/stargate/build/modules";
import {MsgSendEncodeObject} from "@cosmjs/stargate/build/modules";
import {QueryClient} from "@cosmjs/stargate/build/queryclient/queryclient";
import {isDeliverTxSuccess} from "@cosmjs/stargate/build/stargateclient";
import {Tendermint34Client} from "@cosmjs/tendermint-rpc";
import {defaultRegistryTypes} from "@cosmjs/stargate"
import {MsgDelegate} from "cosmjs-types/cosmos/staking/v1beta1/tx";
import {MsgSend} from "cosmjs-types/cosmos/bank/v1beta1/tx";
import {QueryClientImpl as FeemodelQueryClient} from "../coreum-ts/coreum/feemodel/v1/query";
import {MsgIssue} from "../coreum-ts/coreum/asset/ft/v1/tx";
import {Feature} from "../coreum-ts/coreum/asset/ft/v1/token";

export interface MsgIssueEncodeObject extends EncodeObject {
    readonly typeUrl: "/coreum.asset.ft.v1.MsgIssue";
    readonly value: Partial<MsgIssue>;
}

const main = (async function () {
    const coreumAccountPrefix = "testcore"; // the address prefix (different for different chains/environments)
    const coreumHDPath = "m/44'/990'/0'/0/0"; // coreum HD path (same for all chains/environments)
    const coreumDenom = "utestcore"; // core denom (different for different chains/environments)
    const coreumRpcEndpoint = "https://full-node-pluto.testnet-1.coreum.dev:26657"; // rpc endpoint (different for different chains/environments)
    const senderMnemonic =
        "emerge cake river crush explain long else rebuild author duty bulb mind pelican sun alcohol add sample purity two crop wish oven engage tone";

    // ******************** Initialize clients ********************

    const tendermintClient = await Tendermint34Client.connect(coreumRpcEndpoint);
    const queryClient = new QueryClient(tendermintClient);
    const rpcClient = createProtobufRpcClient(queryClient);
    const feemodelQueryClient = new FeemodelQueryClient(rpcClient)
    const stakingExtension = setupStakingExtension(queryClient);

    // the custom tx types should be registered in the types registry
    const ftTypes: ReadonlyArray<[string, GeneratedType]> = [
        ["/coreum.asset.ft.v1.MsgIssue", MsgIssue],
    ];
    let registryTypes: ReadonlyArray<[string, GeneratedType]> = [
        ...defaultRegistryTypes,
        ...ftTypes,
    ]
    const registry = new Registry(registryTypes)

    // ******************** Bank MsgSend example ********************

    console.log("preparing sender wallet");
    const senderWallet = await DirectSecp256k1HdWallet.fromMnemonic(senderMnemonic, {
        prefix: coreumAccountPrefix,
        hdPaths: [stringToPath(coreumHDPath)],
    });
    const [sender] = await senderWallet.getAccounts();
    console.log(`sender address: ${sender.address}`);

    const senderClient = await SigningStargateClient.connectWithSigner(
        coreumRpcEndpoint,
        senderWallet,
        {registry}
    );
    const senderCoreBalance = await senderClient.getBalance(sender.address, coreumDenom);
    console.log(`sender balance: ${senderCoreBalance.amount}`);

    console.log("preparing recipient wallet");
    const recipientWallet = await DirectSecp256k1HdWallet.generate(12, {
        prefix: coreumAccountPrefix,
        hdPaths: [stringToPath(coreumHDPath)],
    });
    const [recipient] = await recipientWallet.getAccounts();
    console.log(`recipient address: ${recipient.address}`);

    const msgBankSend: MsgSendEncodeObject = {
        typeUrl: "/cosmos.bank.v1beta1.MsgSend",
        value: MsgSend.fromPartial({
            fromAddress: sender.address,
            toAddress: recipient.address,
            amount: [{
                denom: coreumDenom,
                amount: "100000",
            }],
        }),
    };
    console.log(
        `sending ${msgBankSend.value.amount?.[0].amount}${msgBankSend.value.amount?.[0].denom} from ${msgBankSend.value.fromAddress} to ${msgBankSend.value.toAddress}`
    );

    let gasPrice = await getGasPriceWithMultiplier(feemodelQueryClient)
    const bankSendGas = await senderClient.simulate(sender.address, [msgBankSend], "")
    console.log(`estimated gas: ${bankSendGas}, gasPrice: ${gasPrice.toString()}`);
    const bankSendFee: StdFee = calculateFee(bankSendGas, gasPrice);
    const bankSendResult = await senderClient.signAndBroadcast(
        sender.address,
        [msgBankSend],
        bankSendFee
    );
    isDeliverTxSuccess(bankSendResult);
    console.log(`successfully sent, tx hash: ${bankSendResult.transactionHash}`);

    const recipientCoreBalance = await senderClient.getBalance(recipient.address, coreumDenom);
    console.log(`recipient balance: ${recipientCoreBalance.amount}`);

    // ******************** Staking MsgDelegate example ********************

    const recipientClient = await SigningStargateClient.connectWithSigner(
        coreumRpcEndpoint,
        recipientWallet,
        {registry}
    );

    // query all bonded validators to find first bonded to delegate to
    const bondedValidators = await stakingExtension.staking.validators("BOND_STATUS_BONDED");
    const validatorOperatorAddress = bondedValidators.validators[0].operatorAddress;
    const msgStakingDelegate: MsgDelegateEncodeObject = {
        typeUrl: "/cosmos.staking.v1beta1.MsgDelegate",
        value: MsgDelegate.fromPartial({
            delegatorAddress: recipient.address,
            validatorAddress: validatorOperatorAddress,
            amount: {
                denom: coreumDenom,
                amount: "100",
            },
        }),
    };
    console.log(
        `delegating ${msgStakingDelegate.value.amount?.amount}${msgStakingDelegate.value.amount?.denom} from ${recipient.address} to ${validatorOperatorAddress}`
    );
    // the gas price can be changed at that time, we need to re-fetch it
    gasPrice = await getGasPriceWithMultiplier(feemodelQueryClient)
    const stakingDelegateGas = await recipientClient.simulate(recipient.address, [msgStakingDelegate], "")
    console.log(`estimated gas: ${stakingDelegateGas}, gasPrice: ${gasPrice.toString()}`);
    const stakingDelegateFee: StdFee = calculateFee(stakingDelegateGas, gasPrice);
    const stakingDelegateResult = await recipientClient.signAndBroadcast(
        recipient.address,
        [msgStakingDelegate],
        stakingDelegateFee
    );
    isDeliverTxSuccess(stakingDelegateResult);
    console.log(`successfully delegated, tx hash: ${stakingDelegateResult.transactionHash}`);

    // ******************** Coreum custom message example, FT ********************

    const msgIssueFT: MsgIssueEncodeObject = {
        typeUrl: "/coreum.asset.ft.v1.MsgIssue",
        value: MsgIssue.fromPartial({
            issuer: sender.address,
            // we add randomisation here for the development only, in real live the symbol and denom should be constants
            subunit: `subunit${(Math.random()).toString(36).substring(5)}`,
            symbol: `symbol${(Math.random()).toString(36).substring(5)}`,
            precision: 18,
            initialAmount: "1000000",
            features: [Feature.minting, Feature.burning],
            sendCommissionRate: `${Decimal.fromUserInput("0.5", 18).atomics}` // equal 50%.
        }),
    };
    const ftDenom = `${msgIssueFT.value.subunit}-${sender.address}`
    console.log(
        `issuing ${ftDenom} FT`
    );

    gasPrice = await getGasPriceWithMultiplier(feemodelQueryClient)
    const issueFTGas = await senderClient.simulate(sender.address, [msgIssueFT], "")
    console.log(`estimated gas: ${issueFTGas}, gasPrice: ${gasPrice.toString()}`);
    const issueFTFee: StdFee = calculateFee(issueFTGas, gasPrice);
    // pay attention that additionally to the gas the `issue_fee` will be burned.
    const issueFTResult = await senderClient.signAndBroadcast(
        sender.address,
        [msgIssueFT],
        issueFTFee
    );
    isDeliverTxSuccess(issueFTResult);
    console.log(`successfully issued, tx hash: ${issueFTResult.transactionHash}`);

    const senderFTBalance = await senderClient.getBalance(sender.address, ftDenom);
    console.log(`sender ft balance: ${senderFTBalance.amount}${ftDenom}`);
})();

export async function getGasPriceWithMultiplier(feemodelQueryClient: FeemodelQueryClient) {
    const gasPriceMultiplier = 1.1
    // the param can be changed via governance
    const feemodelParams = await feemodelQueryClient.Params({})
    const minGasPriceRes = await feemodelQueryClient.MinGasPrice({})
    const minGasPrice = decodeCosmosSdkDecFromProto(minGasPriceRes.minGasPrice?.amount || "")
    let gasPrice = minGasPrice.toFloatApproximation() * gasPriceMultiplier

    const initialGasPrice = decodeCosmosSdkDecFromProto(feemodelParams.params?.model?.initialGasPrice || "").toFloatApproximation()
    if (gasPrice > initialGasPrice) {
        gasPrice = initialGasPrice
    }

    return GasPrice.fromString(`${gasPrice}${minGasPriceRes.minGasPrice?.denom || ""}`);
}

export default main;
