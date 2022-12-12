import { AuthEvents, Handler, Provider, UserData } from '../Signer/types';
import { Penumbra } from '../types/globals';
import { EventEmitter } from 'typed-ts-events';

export class ProviderPenumbra implements Provider {
  public user: UserData | null = null;
  protected _apiPromise: Promise<Penumbra.TPenumbraApi>;
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

  public login(): Promise<UserData> {
    return this._apiPromise
      .then((api) => api.publicState())
      .then((state) => {
        // in this case we already have state.account,
        // otherwise api.publicState will throw an error
        this.user = {
          name: state.account?.name!,
          addressByIndex: state.account?.addressByIndex!,
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
