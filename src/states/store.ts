import { configureStore } from '@reduxjs/toolkit';
import ModalReducer from './modal/reducer';
import LayoutReducer from './layout/reducer';
import DepositReducer from './deposit/reducer';
import WithdrawalReducer from './withdrawal/reducer';

export const store = configureStore({
  reducer: {
    modal: ModalReducer,
    layout: LayoutReducer,
    deposit: DepositReducer,
    withdrawal: WithdrawalReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
