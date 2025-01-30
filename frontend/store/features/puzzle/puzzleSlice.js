import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const puzzleApi = createApi({
  reducerPath: "fetchPuzzle",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/api",
    prepareHeaders(headers) {
      return headers;
    },
    credentials: "include"
  }),
  endpoints: (builder) => ({
    fetchPuzzles: builder.query({
      query: () => {
        return {
          url: `/puzzles/`,
        }
      },
    }),
    fetchPuzzle: builder.query({
      query: (puzzleId) => {
        return {
          url: `/puzzles/${puzzleId}`,
        }
      },
    }),
    createPuzzle: builder.mutation({
      query(body) {
        return {
          url: `/puzzles/`,
          method: 'POST',
          body
        }
      },
    }),
    updatePuzzle: builder.mutation({
      query(body, puzzleId) {
        return {
          url: `/puzzle/${puzzleId}`,
          method: 'PUT',
          body
        }
      },
    }),
  }),
});

export const { useFetchPuzzlesQuery, useFetchPuzzleQuery, useCreatePuzzleMutation, useUpdatePuzzleMutation } = puzzleApi;