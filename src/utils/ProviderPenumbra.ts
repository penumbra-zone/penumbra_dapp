import { AuthEvents, Handler, Provider } from '../Signer/types';
import { Penumbra } from '../types/globals';
import { EventEmitter } from 'typed-ts-events';
import create from 'parse-json-bignumber';
import {
  AssetsRequest,
  AssetsResponse,
  ChainParametersRequest,
  ChainParametersResponse,
  FMDParametersRequest,
  FMDParametersResponse,
  NoteByCommitmentRequest,
  NoteByCommitmentResponse,
  NotesRequest,
  NotesResponse,
  StatusRequest,
  StatusResponse,
  TransactionByHashRequest,
  TransactionByHashResponse,
  TransactionHashesRequest,
  TransactionHashesResponse,
  TransactionsRequest,
  TransactionsResponse,
} from '@buf/bufbuild_es_penumbra-zone_penumbra/penumbra/view/v1alpha1/view_pb';

const { parse } = create();

export function signerTxFactory(signed: string): any {
  return parse(signed);
}

export class ProviderPenumbra implements Provider {
  public user: any | null = null;
  protected _apiPromise: Promise<Penumbra.PenumbraApi>;
  protected _connectPromise: Promise<void>; // used in _ensureApi
  private _connectResolve!: () => void; // initialized in Promise constructor

  private readonly _emitter: EventEmitter<AuthEvents> =
    new EventEmitter<AuthEvents>();

  constructor() {
    this._apiPromise = isPenumbraInstalled().then((isInstalled) => {
      return isInstalled
        ? window.penumbra.initialPromise.then((api) => Promise.resolve(api))
        : Promise.reject(new Error('WavesKeeper is not installed.'));
    });

    this._apiPromise.catch(() => {
      // avoid unhandled rejection
    });

    this._connectPromise = new Promise((resolve) => {
      this._connectResolve = resolve;
    });
  }

  public on<EVENT extends keyof AuthEvents>(
    event: EVENT,
    handler: Handler<AuthEvents[EVENT]>
  ): Provider {
    this._emitter.on(event, handler);

    return this;
  }

  public once<EVENT extends keyof AuthEvents>(
    event: EVENT,
    handler: Handler<AuthEvents[EVENT]>
  ): Provider {
    this._emitter.once(event, handler);

    return this;
  }

  public off<EVENT extends keyof AuthEvents>(
    event: EVENT,
    handler: Handler<AuthEvents[EVENT]>
  ): Provider {
    this._emitter.off(event, handler);

    return this;
  }

  public login(): Promise<any> {
    return this._apiPromise
      .then((api) => api.publicState())
      .then((state) => {
        // in this case we already have state.account,
        // otherwise api.publicState will throw an error
        this.user = {
          name: state.account?.name!,
          addressByIndex: state.account?.addressByIndex!,
          ...state,
        };
        this._emitter.trigger('login', this.user);
        return this.user;
      });
  }

  public logout(): Promise<void> {
    this.user = null;
    this._emitter.trigger('logout', void 0);
    return Promise.resolve();
  }

  public getAssets(request?: AssetsRequest) {
    return this._apiPromise
      .then((api) => api.getAssets())
      .then((data) => {
        const res = data.map((i) => {
          return new AssetsResponse().fromBinary(
            new Uint8Array(Object.values(i))
          );
        });
        return res;
      });
  }

  public getChainParameters(request?: ChainParametersRequest) {
    return this._apiPromise
      .then((api) => api.getChainParameters())
      .then((data) => {
        const res = new ChainParametersResponse().fromBinary(
          new Uint8Array(Object.values(data))
        );
        return res;
      });
  }

  public getFmdParameters(request?: FMDParametersRequest) {
    return this._apiPromise
      .then((api) => api.getFmdParameters())
      .then((data) => {
        const res = new FMDParametersResponse().fromBinary(
          new Uint8Array(Object.values(data))
        );

        return res;
      });
  }

  public getNotes(request?: NotesRequest) {
    return this._apiPromise
      .then((api) => api.getNotes())
      .then((data) => {
        const res = data.map((i) => {
          return new NotesResponse().fromBinary(
            new Uint8Array(Object.values(i))
          );
        });
        return res;
      });
  }

  public getNoteByCommitment(request: object) {
    return this._apiPromise
      .then((api) =>
        api.getNoteByCommitment(new NoteByCommitmentRequest(request).toBinary())
      )
      .then((data) => {
        const res = new NoteByCommitmentResponse().fromBinary(
          new Uint8Array(Object.values(data))
        );

        return res;
      });
  }

  public getStatus(request?: StatusRequest) {
    return this._apiPromise
      .then((api) => api.getStatus())
      .then((data) => {
        const res = new StatusResponse().fromBinary(
          new Uint8Array(Object.values(data))
        );

        return res;
      });
  }

  public getTransactionHashes(request?: object) {
    return this._apiPromise
      .then((api) =>
        api.getTransactionHashes(
          new TransactionHashesRequest(request).toBinary()
        )
      )
      .then((data) => {
        const res = data.map((i) => {
          return new TransactionHashesResponse().fromBinary(
            new Uint8Array(Object.values(i))
          );
        });

        return res;
      });
  }

  public getTransactions(request?: object) {
    return this._apiPromise
      .then((api) =>
        api.getTransactions(new TransactionsRequest(request).toBinary())
      )
      .then((data) => {
        const res = data.map((i) => {
          return new TransactionsResponse().fromBinary(
            new Uint8Array(Object.values(i))
          );
        });

        return res;
      });
  }

  public getTransactionByHash(request?: object) {
    return this._apiPromise
      .then((api) => {
        return api.getTransactionByHash(
          new TransactionByHashRequest(request).toBinary()
        );
      })
      .then((data) => {
        const res = new TransactionByHashResponse().fromBinary(
          new Uint8Array(Object.values(data))
        );

        return res;
      });
  }
}

const poll = (
  resolve: (result: boolean) => void,
  reject: (...args: unknown[]) => void,
  attempt = 0,
  retries = 30,
  interval = 100
) => {
  if (attempt > retries) return resolve(false);

  if (typeof window.penumbra !== 'undefined') {
    return resolve(true);
  } else setTimeout(() => poll(resolve, reject, ++attempt), interval);
};

const _isPenumbraInstalled = new Promise(poll);

export async function isPenumbraInstalled() {
  return _isPenumbraInstalled;
}
