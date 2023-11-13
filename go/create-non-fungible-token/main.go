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
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"

	"github.com/CoreumFoundation/coreum/v3/pkg/client"
	coreumconfig "github.com/CoreumFoundation/coreum/v3/pkg/config"
	"github.com/CoreumFoundation/coreum/v3/pkg/config/constant"
	coreumkeyring "github.com/CoreumFoundation/coreum/v3/pkg/keyring"
	assetnfttypes "github.com/CoreumFoundation/coreum/v3/x/asset/nft/types"
	"github.com/CoreumFoundation/coreum/v3/x/nft"
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

	encodingConfig := coreumconfig.NewEncodingConfig(modules)

	clientCtx := client.NewContext(client.DefaultContextConfig(), modules).
		WithChainID(string(chainID)).
		WithGRPCClient(grpcClient).
		WithKeyring(coreumkeyring.NewConcurrentSafeKeyring(keyring.NewInMemory(encodingConfig.Codec))).
		WithBroadcastMode(flags.BroadcastSync)

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

	senderAddress, _ := senderInfo.GetAddress()
	ctx := context.Background()
	// Broadcast transaction issuing new nft class
	const classSymbol = "NFTClass"
	msgIssueClass := &assetnfttypes.MsgIssueClass{
		Issuer:      senderAddress.String(),
		Symbol:      classSymbol,
		Name:        "NFT Class",
		Description: "NFT Class",
		Features:    []assetnfttypes.ClassFeature{assetnfttypes.ClassFeature_freezing},
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		msgIssueClass,
	)
	if err != nil {
		panic(err)
	}

	// Broadcast transaction minting new nft
	classID := assetnfttypes.BuildClassID(classSymbol, senderAddress)
	const nftID = "myNFT"
	msgMint := &assetnfttypes.MsgMint{
		Sender:  senderAddress.String(),
		ClassID: classID,
		ID:      nftID,
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		msgMint,
	)
	if err != nil {
		panic(err)
	}

	// Query the owner of the NFT
	nftClient := nft.NewQueryClient(clientCtx)
	resp, err := nftClient.Owner(ctx, &nft.QueryOwnerRequest{
		ClassId: classID,
		Id:      nftID,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Owner: %s\n", resp.Owner)

	// Send the NFT to someone
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
	msgSend := &nft.MsgSend{
		Sender:   senderAddress.String(),
		Receiver: recipientAddress.String(),
		Id:       nftID,
		ClassId:  classID,
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

	// Query the owner of the NFT again
	resp, err = nftClient.Owner(ctx, &nft.QueryOwnerRequest{
		ClassId: classID,
		Id:      nftID,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Owner: %s\n", resp.Owner)

	// Freeze balance portion of the recipient's balance
	msgFreeze := &assetnfttypes.MsgFreeze{
		Sender:  senderAddress.String(),
		ClassID: classID,
		ID:      nftID,
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		msgFreeze,
	)
	if err != nil {
		panic(err)
	}
}
