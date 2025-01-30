import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query';

import authReducer from './features/auth/authSlice';
import { leaderboardApi } from './features/leaderboard/leaderboardSlice';
import { profileApi } from './features/profile/profileSlice';
import { puzzleApi } from './features/puzzle/puzzleSlice';
import { rewardApi } from './features/reward/rewardSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      [leaderboardApi.reducerPath]: leaderboardApi.reducer,
      [profileApi.reducerPath]: profileApi.reducer,
      [puzzleApi.reducerPath]: puzzleApi.reducer,
      [rewardApi.reducerPath]: puzzleApi.reducer,
    },
    // Adding the api middleware enables caching, invalidation, polling, and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(leaderboardApi.middleware, profileApi.middleware, puzzleApi.middleware, rewardApi.middleware, conversationApi.middleware, messageApi.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
};

setupListeners(makeStore.dispatch);
