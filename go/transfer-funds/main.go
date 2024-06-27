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

	"github.com/CoreumFoundation/coreum/v4/pkg/client"
	coreumconfig "github.com/CoreumFoundation/coreum/v4/pkg/config"
	"github.com/CoreumFoundation/coreum/v4/pkg/config/constant"
)

const (
	// Replace it with your own mnemonic
	senderMnemonic = "dish category castle eight torch cross head casual viable virtual inform skirt search area neutral muscle lens hello lounge base away danger forum congress"

	chainID          = constant.ChainIDTest
	addressPrefix    = constant.AddressPrefixTest
	denom            = constant.DenomTest
	recipientAddress = "testcore1534s8rz2e36lwycr6gkm9vpfe5yf67wkuca7zs"
	nodeAddress      = "full-node.testnet-1.coreum.dev:9090"
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

	senderAddress, err := senderInfo.GetAddress()
	if err != nil {
		panic(err)
	}

	fmt.Println(senderAddress.String())

	// Validate address
	_, err = sdk.AccAddressFromBech32(senderAddress.String())
	if err != nil {
		panic(err)
	}

	// Broadcast transaction transferring funds
	msg := &banktypes.MsgSend{
		FromAddress: senderAddress.String(),
		ToAddress:   recipientAddress,
		Amount:      sdk.NewCoins(sdk.NewInt64Coin(denom, 9_000_000)),
	}

	ctx := context.Background()
	result, err := client.BroadcastTx(
		ctx,
		clientCtx.WithFromAddress(senderAddress),
		txFactory,
		msg,
	)
	if err != nil {
		panic(err)
	}
	fmt.Printf("Tx hash: %s\n", result.TxHash)

	// Query balances
	bankClient := banktypes.NewQueryClient(clientCtx)
	balances, err := bankClient.AllBalances(ctx, &banktypes.QueryAllBalancesRequest{
		Address: recipientAddress,
	})
	if err != nil {
		panic(err)
	}
	fmt.Printf("Balances: %s\n", balances.Balances)
}
