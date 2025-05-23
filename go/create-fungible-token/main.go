package main

import (
	"context"
	"crypto/tls"
	"fmt"

	sdkmath "cosmossdk.io/math"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/codec"
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
	senderMnemonic    = "your sender mnemonic"
	recipientMnemonic = "your recipient mnemonic"

	chainID       = constant.ChainIDDev
	addressPrefix = constant.AddressPrefixDev
	nodeAddress   = "full-node.devnet-1.coreum.dev:9090"
)

func main() {
	// Configure Cosmos SDK
	config := sdk.GetConfig()
	config.SetBech32PrefixForAccount(addressPrefix, addressPrefix+"pub")
	config.SetCoinType(constant.CoinType)
	config.Seal()

	// List required modules.
	modules := module.NewBasicManager(
		auth.AppModuleBasic{},
	)

	encodingConfig := coreumconfig.NewEncodingConfig(modules)

	pc, ok := encodingConfig.Codec.(codec.GRPCCodecProvider)
	if !ok {
		panic("failed to cast codec to codec.GRPCCodecProvider")
	}

	// Configure client context and tx factory
	grpcClient, err := grpc.Dial(
		nodeAddress,
		grpc.WithDefaultCallOptions(grpc.ForceCodec(pc.GRPCCodec())),
		grpc.WithTransportCredentials(credentials.NewTLS(&tls.Config{MinVersion: tls.VersionTLS12})),
	)
	if err != nil {
		panic(err)
	}

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
		"sender-key-name",
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
		Features:      []assetfttypes.Feature{assetfttypes.Feature_freezing, assetfttypes.Feature_clawback},
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
	recipientInfo, err := clientCtx.Keyring().NewAccount(
		"recipient-key-name",
		recipientMnemonic,
		"",
		sdk.GetConfig().GetFullBIP44Path(),
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

	// Clawback function: Try to claw back some tokens
	fmt.Println("Attempting clawback...")

	clawbackMsg := &assetfttypes.MsgClawback{
		Sender:  senderAddress.String(),
		Account: recipientAddress.String(),
		Coin:    sdk.NewCoin(denom, sdk.NewInt(500_000)),
	}
	txResponse, err := client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		clawbackMsg,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Clawback transaction broadcasted successfully, TxHash:", txResponse.TxHash)

	// Query the balance of the recipient after clawback
	resp, err = bankClient.Balance(ctx, &banktypes.QueryBalanceRequest{
		Address: recipientAddress.String(),
		Denom:   denom,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Recipient's balance after clawback: %s\n", resp.Balance)

	// Query the balance of the issuer after clawback
	resp, err = bankClient.Balance(ctx, &banktypes.QueryBalanceRequest{
		Address: senderAddress.String(),
		Denom:   denom,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Issuer's balance after clawback: %s\n", resp.Balance)

	assetftClient := assetfttypes.NewQueryClient(clientCtx)
	res, err := assetftClient.Token(ctx, &assetfttypes.QueryTokenRequest{
		Denom: denom,
	})
	if err != nil {
		panic(err)
	}

	fmt.Printf("Token admin: %s\n", res.Token.Admin)

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

	res, err = assetftClient.Token(ctx, &assetfttypes.QueryTokenRequest{
		Denom: denom,
	})
	if err != nil {
		panic(err)
	}

	fmt.Printf("Token admin: %s\n", res.Token.Admin)

	// Clear admin rights
	msgClearAdmin := &assetfttypes.MsgClearAdmin{
		Sender: recipientAddress.String(),
		Denom:  denom,
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(recipientAddress),
		txFactory,
		msgClearAdmin,
	)
	if err != nil {
		panic(err)
	}
	fmt.Println("Admin clear message broadcasted successfully")

	res, err = assetftClient.Token(ctx, &assetfttypes.QueryTokenRequest{
		Denom: denom,
	})
	if err != nil {
		panic(err)
	}

	if res.Token.Admin == "" {
		fmt.Print("Token admin: no one\n")
	} else {
		fmt.Printf("Token admin: %s\n", res.Token.Admin)
	}
}
