import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rewardApi = createApi({
  reducerPath: "fetchReward",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include"
  }),
  endpoints: (builder) => ({
    fetchRewards: builder.query({
      query: () => {
        return {
          url: `/rewards/`,
        }
      },
    }),
    fetchReward: builder.query({
      query: (rewardId) => {
        return {
          url: `/rewards/${rewardId}`,
        }
      },
    }),
    createReward: builder.mutation({
      query(body) {
        return {
          url: `/rewards/`,
          method: 'POST',
          body
        }
      },
    }),
    updateReward: builder.mutation({
      query(body, rewardId) {
        return {
          url: `/reward/${rewardId}`,
          method: 'PUT',
          body
        }
      },
    }),
  }),
});

export const { useFetchRewardsQuery, useFetchRewardQuery, useCreateRewardMutation, useUpdateRewardMutation } = rewardApi;