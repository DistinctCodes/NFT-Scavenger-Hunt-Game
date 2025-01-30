import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const profileApi = createApi({
  reducerPath: "fetchProfile",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include"
  }),
  endpoints: (builder) => ({
    fetchProfile: builder.query({
      query: (profileId) => {
        return {
          url: `/profile/${profileId}`,
        }
      },
    }),
    createProfile: builder.mutation({
      query(body) {
        return {
          url: `/profile/`,
          method: 'POST',
          body
        }
      },
    }),
    updateProfile: builder.mutation({
      query(body, profileId) {
        return {
          url: `/profile/${profileId}`,
          method: 'PUT',
          body
        }
      },
    }),
  }),
});

export const { useFetchProfileQuery, useCreateProfileMutation, useUpdateProfileMutation } = profileApi;