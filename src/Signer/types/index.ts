export interface UserData {
  name: string;
  addressByIndex: string;
}

export interface Provider {
  user: UserData | null;

  on<EVENT extends keyof AuthEvents>(
    event: EVENT,
    handler: Handler<AuthEvents[EVENT]>
  ): Provider;

  once<EVENT extends keyof AuthEvents>(
    event: EVENT,
    handler: Handler<AuthEvents[EVENT]>
  ): Provider;

  off<EVENT extends keyof AuthEvents>(
    event: EVENT,
    handler: Handler<AuthEvents[EVENT]>
  ): Provider;
  /**
   * Logs in user using provider
   */
  login(): Promise<UserData>;
}
export type Handler<T> = (data: T) => any;

export type AuthEvents = {
  login: Readonly<UserData>;
  logout: void;
};
