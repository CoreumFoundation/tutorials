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

	"github.com/CoreumFoundation/coreum/v2/pkg/client"
	"github.com/CoreumFoundation/coreum/v2/pkg/config/constant"
	assetnfttypes "github.com/CoreumFoundation/coreum/v2/x/asset/nft/types"
	"github.com/CoreumFoundation/coreum/v2/x/nft"
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

	// Broadcast transaction issuing new nft class
	const classSymbol = "NFTClass"
	msgIssueClass := &assetnfttypes.MsgIssueClass{
		Issuer:      senderInfo.GetAddress().String(),
		Symbol:      classSymbol,
		Name:        "NFT Class",
		Description: "NFT Class",
		Features:    []assetnfttypes.ClassFeature{assetnfttypes.ClassFeature_freezing},
	}

	ctx := context.Background()
	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderInfo.GetAddress()),
		txFactory,
		msgIssueClass,
	)
	if err != nil {
		panic(err)
	}

	// Broadcast transaction minting new nft
	classID := assetnfttypes.BuildClassID(classSymbol, senderInfo.GetAddress())
	const nftID = "myNFT"
	msgMint := &assetnfttypes.MsgMint{
		Sender:  senderInfo.GetAddress().String(),
		ClassID: classID,
		ID:      nftID,
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderInfo.GetAddress()),
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

	msgSend := &nft.MsgSend{
		Sender:   senderInfo.GetAddress().String(),
		Receiver: recipientInfo.GetAddress().String(),
		Id:       nftID,
		ClassId:  classID,
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
		Sender:  senderInfo.GetAddress().String(),
		ClassID: classID,
		ID:      nftID,
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
