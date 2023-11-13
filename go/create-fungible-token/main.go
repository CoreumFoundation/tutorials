package main

import (
	"context"
	"crypto/tls"
	"fmt"

	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/crypto/hd"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	"github.com/cosmos/cosmos-sdk/x/auth"
	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"

	"github.com/CoreumFoundation/coreum/v3/pkg/client"
	"github.com/CoreumFoundation/coreum/v3/pkg/config/constant"
	assetfttypes "github.com/CoreumFoundation/coreum/v3/x/asset/ft/types"
)

const (
	// Replace it with your own mnemonic
	senderMnemonic = "dish category castle eight torch cross head casual viable virtual inform skirt search area neutral muscle lens hello lounge base away danger forum congress"

	chainID       = constant.ChainIDTest
	addressPrefix = constant.AddressPrefixTest
	nodeAddress   = "full-node.testnet-1.coreum.dev:9090"
)

func main() {
	// Configure Cosmos SDK
	config := sdk.GetConfig()
	config.SetBech32PrefixForAccount(addressPrefix, addressPrefix+"pub")
	config.SetCoinType(constant.CoinType)
	config.Seal()

	// List required modules.
	// If you need types from any other module import them and add here.
	modules := module.NewBasicManager(
		auth.AppModuleBasic{},
	)

	// Configure client context and tx factory
	// If you don't use TLS then replace `grpc.WithTransportCredentials()` with `grpc.WithInsecure()`
	grpcClient, err := grpc.Dial(nodeAddress, grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{})))
	if err != nil {
		panic(err)
	}

	clientCtx := client.NewContext(client.DefaultContextConfig(), modules).
		WithChainID(string(chainID)).
		WithGRPCClient(grpcClient).
		WithKeyring(keyring.NewInMemory()).
		WithBroadcastMode(flags.BroadcastBlock)

	txFactory := client.Factory{}.
		WithKeybase(clientCtx.Keyring()).
		WithChainID(clientCtx.ChainID()).
		WithTxConfig(clientCtx.TxConfig()).
		WithSimulateAndExecute(true)

	// Generate private key and add it to the keystore
	senderInfo, err := clientCtx.Keyring().NewAccount(
		"key-name",
		senderMnemonic,
		"",
		sdk.GetConfig().GetFullBIP44Path(),
		hd.Secp256k1,
	)
	if err != nil {
		panic(err)
	}

	// Broadcast transaction issuing new fungible token
	const subunit = "uabc"
	msgIssue := &assetfttypes.MsgIssue{
		Issuer:        senderInfo.GetAddress().String(),
		Symbol:        "ABC",
		Subunit:       subunit,
		Precision:     6,
		InitialAmount: sdk.NewInt(100_000_000),
		Description:   "ABC coin",
		Features:      []assetfttypes.Feature{assetfttypes.Feature_freezing},
	}

	ctx := context.Background()
	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderInfo.GetAddress()),
		txFactory,
		msgIssue,
	)
	if err != nil {
		panic(err)
	}

	// Query initial balance hold by the issuer
	denom := subunit + "-" + senderInfo.GetAddress().String()
	bankClient := banktypes.NewQueryClient(clientCtx)
	resp, err := bankClient.Balance(ctx, &banktypes.QueryBalanceRequest{
		Address: senderInfo.GetAddress().String(),
		Denom:   denom,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Issuer's balance: %s\n", resp.Balance)

	// Send issued token to someone
	recipientInfo, _, err := clientCtx.Keyring().NewMnemonic(
		"recipient",
		keyring.English,
		sdk.GetConfig().GetFullBIP44Path(),
		"",
		hd.Secp256k1,
	)
	if err != nil {
		panic(err)
	}

	msgSend := &banktypes.MsgSend{
		FromAddress: senderInfo.GetAddress().String(),
		ToAddress:   recipientInfo.GetAddress().String(),
		Amount:      sdk.NewCoins(sdk.NewInt64Coin(denom, 1_000_000)),
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderInfo.GetAddress()),
		txFactory,
		msgSend,
	)
	if err != nil {
		panic(err)
	}

	// Query the balance of the recipient
	resp, err = bankClient.Balance(ctx, &banktypes.QueryBalanceRequest{
		Address: recipientInfo.GetAddress().String(),
		Denom:   denom,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Recipient's balance: %s\n", resp.Balance)

	// Freeze balance portion of the recipient's balance
	msgFreeze := &assetfttypes.MsgFreeze{
		Sender:  senderInfo.GetAddress().String(),
		Account: recipientInfo.GetAddress().String(),
		Coin:    sdk.NewInt64Coin(denom, 500_000),
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderInfo.GetAddress()),
		txFactory,
		msgFreeze,
	)
	if err != nil {
		panic(err)
	}
}
