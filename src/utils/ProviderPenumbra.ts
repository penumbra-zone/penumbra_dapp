export interface UserData {
  address: string;
  publicKey: string;
}

interface Provider {
  user: UserData | null;
}

export class ProviderPenumbra implements Provider {
  public user: UserData | null = null;
//   protected _apiPromise: Promise<WavesKeeper.TWavesKeeperApi>;

  constructor() {
    // this._apiPromise = isPenumbraInstalled();
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