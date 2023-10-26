import {QueryClientImpl as NFTQueryClient} from "./proto-ts/coreum/nft/v1beta1/query";
import {QueryClientImpl as FTQueryClient} from "./proto-ts/coreum/asset/ft/v1/query";

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

export class QueryClient {
  private readonly nftClient: NFTQueryClient;
  private readonly ftClient: FTQueryClient;

  constructor(rpc: Rpc) {
    this.nftClient = new NFTQueryClient(rpc)
    this.ftClient = new FTQueryClient(rpc)
  }

  public NFTClient(): NFTQueryClient {
    return this.nftClient
  }

  public FTClient(): FTQueryClient {
    return this.ftClient
  }
}
