package main

import (
	"context"
	"crypto/tls"
	"fmt"

	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/crypto/hd"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	"github.com/cosmos/cosmos-sdk/x/auth"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials"

	"github.com/cosmos/cosmos-sdk/x/nft"

	"github.com/CoreumFoundation/coreum/v4/pkg/client"
	coreumconfig "github.com/CoreumFoundation/coreum/v4/pkg/config"
	"github.com/CoreumFoundation/coreum/v4/pkg/config/constant"
	assetnfttypes "github.com/CoreumFoundation/coreum/v4/x/asset/nft/types"
)

const (
	// Replace it with your own mnemonic
	senderMnemonic = "hair album dose tribe vendor risk inmate helmet size artefact sadness repeat laugh range access this target picture develop parent quarter trap either very"

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
	// If you need types from any other module import them and add here.
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

	// Generate a private key and add it to the keystore
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
	senderAddress, err := senderInfo.GetAddress()
	if err != nil {
		panic(err)
	}
	const classSymbol = "NFTClass"
	msgIssueClass := &assetnfttypes.MsgIssueClass{
		Issuer:      senderAddress.String(),
		Symbol:      classSymbol,
		Name:        "NFT Class",
		Description: "NFT Class",
		Features:    []assetnfttypes.ClassFeature{assetnfttypes.ClassFeature_freezing},
	}

	ctx := context.Background()
	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		msgIssueClass,
	)
	if err != nil {
		panic(err)
	}

	jsonData := []byte(`{"name": "Name", "description": "Description"}`)
	dataBytes := assetnfttypes.DataBytes{
		Data: jsonData,
	}
	data, err := codectypes.NewAnyWithValue(&dataBytes)
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
		Data:    data,
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

	dataDynamic := assetnfttypes.DataDynamic{
		Items: []assetnfttypes.DataDynamicItem{
			{
				Editors: []assetnfttypes.DataEditor{
					assetnfttypes.DataEditor_owner,
				},
				Data: jsonData,
			},
		},
	}
	data, err = codectypes.NewAnyWithValue(&dataDynamic)
	if err != nil {
		panic(err)
	}

	// Broadcast transaction minting new dynamic nft
	classID = assetnfttypes.BuildClassID(classSymbol, senderAddress)
	const dynamicNftID = "myDynamicNFT"
	msgMint = &assetnfttypes.MsgMint{
		Sender:  senderAddress.String(),
		ClassID: classID,
		ID:      dynamicNftID,
		Data:    data,
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

	// Query the nft
	storedNFT, err := nftClient.NFT(ctx, &nft.QueryNFTRequest{
		ClassId: classID,
		Id:      dynamicNftID,
	})
	if err != nil {
		panic(err)
	}

	var storedDataDynamic assetnfttypes.DataDynamic
	err = storedDataDynamic.Unmarshal(storedNFT.Nft.Data.Value)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Data: %s\n", string(storedDataDynamic.Items[0].Data))

	// update stored NFT
	msgUpdateData := &assetnfttypes.MsgUpdateData{
		Sender:  senderAddress.String(),
		ClassID: classID,
		ID:      dynamicNftID,
		Items: []assetnfttypes.DataDynamicIndexedItem{
			{
				Index: 0,
				Data:  []byte(`{"name": "Updated Name", "description": "Updated Description"}`),
			},
		},
	}

	_, err = client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		msgUpdateData,
	)
	if err != nil {
		panic(err)
	}

	storedNFT, err = nftClient.NFT(ctx, &nft.QueryNFTRequest{
		ClassId: classID,
		Id:      dynamicNftID,
	})
	if err != nil {
		panic(err)
	}

	var storedDataDynamic2 assetnfttypes.DataDynamic
	err = storedDataDynamic2.Unmarshal(storedNFT.Nft.Data.Value)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Data: %s\n", string(storedDataDynamic2.Items[0].Data))
}
