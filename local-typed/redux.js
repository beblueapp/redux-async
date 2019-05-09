declare module 'redux' {
  declare type State = any
  declare type Action<P, M> = { type: string, payload?: P, error?: boolean, meta?: M}
  declare type Dispatch<A> = (action: A | ThunkAction<A, any>) => any;
  declare type GetState = () => State;
  declare type ThunkAction<A, R> = (dispatch: Dispatch<A>, getState: GetState) => R;
}
