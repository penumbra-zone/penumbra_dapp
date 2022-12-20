import {
  NoteByCommitmentRequest,
  NoteByCommitmentResponse,
  NotesRequest,
  NotesResponse,
  TransactionHashesRequest,
  TransactionHashesResponse,
  ChainParametersRequest,
  ChainParametersResponse,
  StatusRequest,
  StatusResponse,
  TransactionByHashRequest,
  TransactionByHashResponse,
  TransactionsRequest,
  TransactionsResponse,
  FMDParametersRequest,
  AssetsRequest,
  AssetsResponse,
} from '@buf/bufbuild_es_penumbra-zone_penumbra/penumbra/view/v1alpha1/view_pb';
declare global {
  interface Window {
    penumbra: Penumbra.PenumbraApi;
  }
}

export declare namespace Penumbra {
  type PenumbraApi = {
    /**
     * If a website is trusted, Penumbra public data are returned.
     */
    publicState(): Promise<any>;
    /**
     * On initialize window.penumbra has no api methods.
     * You can use penumbra.initialPromise for waiting end initializing api
     */
    initialPromise: Promise<any>;

    /**
     * Allows subscribing to Waves Keeper events.
     * If a website is not trusted, events won't show.
     * @param event
     * Supports events:
     * update – subscribe to updates of the state
     * @param cb
     */
    on(event: 'update', cb: (state: PublicStateResponse) => any): object;

    getAssets(request?: AssetsRequest): Promise<object[]>;
    getChainParameters(request?: ChainParametersRequest): Promise<object>;
    getNotes(request?: NotesRequest): Promise<object[]>;
    getNoteByCommitment(
      request: object
    ): Promise<object>;

    getStatus(request?: StatusRequest): Promise<StatusResponse>;
    getTransactionHashes(
      request?: TransactionHashesRequest
    ): Promise<TransactionHashesResponse[]>;
    getTransactionByHash(
      request: TransactionByHashRequest
    ): Promise<TransactionByHashResponse>;
    getTransactions(
      request?: TransactionsRequest
    ): Promise<TransactionsResponse[]>;
    getNoteByCommitment(
      request: NoteByCommitmentRequest
    ): Promise<NoteByCommitmentResponse>;
    getFmdParameters(request?: FMDParametersRequest): Promise<object>;
  };

  interface PublicStateResponse {
    initialized: boolean;
    locked: boolean;
    account: PublicStateAccount | null;
  }

  type PublicStateAccount = {
    name: string;
    addressByIndex: string;
  };
}

export {};
