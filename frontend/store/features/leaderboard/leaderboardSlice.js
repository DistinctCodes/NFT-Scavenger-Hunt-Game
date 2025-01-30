import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const leaderboardApi = createApi({
  reducerPath: "fetchLeaderboard",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include"
  }),
  tagTypes: ["Leaderboard"],
  endpoints: (builder) => ({
    fetchLeaderboard: builder.query({
      query: () => {
        return {
          url: `/leaderboard/}`,
        }
      },
      providesTags: (result) =>
        result ?
            [
              ...result.map(({ id }) => ({ type: 'Leaderboard', id })),
              { type: 'Leaderboard', id: 'LIST' },
            ]
          : 
            [{ type: 'Leaderboard', id: 'LIST' }],
    }),
    storeLeaderboard: builder.mutation({
      query(body) {
        return {
          url: `/leaderboard/`,
          method: 'POST',
          body,
        }
      },
      invalidatesTags: [{ type: 'Leaderboard', id: 'LIST' }],
    }),
  }),
});

export const { useFetchLeaderboardQuery, useStoreLeaderboardMutation } = leaderboardApi;