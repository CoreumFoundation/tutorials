package main

import (
	"context"
	"crypto/tls"
	"fmt"

	sdkmath "cosmossdk.io/math"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/crypto/hd"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	"github.com/cosmos/cosmos-sdk/x/auth"
	banktypes "github.com/cosmos/cosmos-sdk/x/bank/types"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"

	"github.com/CoreumFoundation/coreum/v4/pkg/client"
	coreumconfig "github.com/CoreumFoundation/coreum/v4/pkg/config"
	"github.com/CoreumFoundation/coreum/v4/pkg/config/constant"
	assetfttypes "github.com/CoreumFoundation/coreum/v4/x/asset/ft/types"
)

const (
	// Replace it with your own mnemonic
	senderMnemonic = "rough olympic update gloom play squirrel license pride cup hazard onion effort"

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
	grpcClient, err := grpc.Dial(nodeAddress, grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{MinVersion: tls.VersionTLS12})))
	if err != nil {
		panic(err)
	}

	encodingConfig := coreumconfig.NewEncodingConfig(modules)

	clientCtx := client.NewContext(client.DefaultContextConfig(), modules).
		WithChainID(string(chainID)).
		WithGRPCClient(grpcClient).
		WithKeyring(keyring.NewInMemory(encodingConfig.Codec)).
		WithBroadcastMode(flags.BroadcastSync).
		WithAwaitTx(true)

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
	senderAddress, err := senderInfo.GetAddress()
	if err != nil {
		panic(err)
	}
	const subunit = "hahahahaha"

	msgIssue := &assetfttypes.MsgIssue{
		Issuer:        senderAddress.String(),
		Symbol:        "HAHAHAHAH",
		Subunit:       subunit,
		Precision:     6,
		InitialAmount: sdkmath.NewInt(100_000_000),
		Description:   "HAAHHA coin",
		Features:      []assetfttypes.Feature{assetfttypes.Feature_freezing},
	}

	ctx := context.Background()
	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		msgIssue,
	)
	if err != nil {
		panic(err)
	}

	// Query initial balance held by the issuer
	denom := subunit + "-" + senderAddress.String()
	bankClient := banktypes.NewQueryClient(clientCtx)
	resp, err := bankClient.Balance(ctx, &banktypes.QueryBalanceRequest{
		Address: senderAddress.String(),
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

	recipientAddress, err := recipientInfo.GetAddress()
	if err != nil {
		panic(err)
	}

	msgSend := &banktypes.MsgSend{
		FromAddress: senderAddress.String(),
		ToAddress:   recipientAddress.String(),
		Amount:      sdk.NewCoins(sdk.NewInt64Coin(denom, 1_000_000)),
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		msgSend,
	)
	if err != nil {
		panic(err)
	}

	// Query the balance of the recipient
	resp, err = bankClient.Balance(ctx, &banktypes.QueryBalanceRequest{
		Address: recipientAddress.String(),
		Denom:   denom,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Recipient's balance: %s\n", resp.Balance)

	// Transfer admin rights
	msgTransferAdmin := &assetfttypes.MsgTransferAdmin{
		Sender:  senderAddress.String(),
		Account: recipientAddress.String(),
		Denom:   denom,
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		msgTransferAdmin,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Admin transfer message broadcasted successfully")
}
