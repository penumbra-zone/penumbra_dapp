declare global {
  interface Window {
    penumbra: Penumbra.TPenumbraApi;
  }
}

declare namespace Penumbra {
  type TPenumbraApi = {
    publicState(): Promise<IPublicStateResponse>;
    getAssets(): Promise<TAsset[]>;
    getChainParameters(): Promise<string>;
    getNotes(): Promise<TNote[]>;
    getStatus(): Promise<TStatus>;
    getTransactionHashes(
      start_height?: number,
      end_height?: number
    ): Promise<TTransactionHashe[]>;
    getTransactionByHash(tx_hash: string): Promise<TTransactionByHash>;
    getTransactions(
      start_height?: number,
      end_height?: number
    ): Promise<TTransaction[]>;
    getNoteByCommitment(note_commitment): Promise<TNote>;
  };

  interface IPublicStateResponse {
    initialized: boolean;
    locked: boolean;
    account: TPublicStateAccount | null;
  }

  type TAsset = {
    denom: string;
    id: string;
  };

  type TPublicStateAccount = {
    name: string;
    addressByIndex: string;
  };

  type TNote = {
    address_index: number;
    height_created: number;
    note_commitment: string;
    source: string;
    //TODO add position and height_spent
    height_spent: any;
    position: any;
    note: {
      address: string;
      note_blinding: string;
      value: {
        asset_id: string;
        amount: {
          hi: number;
          lo: number;
        };
      };
    };
    nullifier: string[];
  };

  type TStatus = {
    sync_height: number;
    catching_up: boolean;
    last_block: number;
  };

  type TTransactionHashe = {
    block_height: number;
    tx_hash: string;
  };

  type TTransactionByHash = {
    anchor: string;
    binding_sig: string;
    body: TTransactionBody;
  };

  type TTransactionBody = {
    //TODO add action
    action: any[];
    expiry_height: number;
    chain_id: string;
    fee: {
      asset_id: string | null;
      amount: {
        hi: number;
        lo: number;
      };
    };
    fmd_clues: string[];
    encrypted_memo: string[];
  };

  type TTransaction = {
    block_height: number;
    tx_hash: string;
    tx: TTransactionByHash;
  };
}

export {};
