import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const giphyAPIKey = 'W22xwIX2OmIgy3W5FRLmL70dTWdlZEgK';

export const gifApi = createApi({
    reducerPath: 'gifApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'https://api.giphy.com/v1/gifs',
    }),
    endpoints: (builder) => ({
        fetchGifs: builder.query<any, string>({
            query: (value) => {
                if (value) {
                    return `/trending?api_key=${giphyAPIKey}&q=${encodeURIComponent(value.trim())}`;
                }
                return `/trending?api_key=${giphyAPIKey}`;
            },
        }),
    }),
});

export const { useLazyFetchGifsQuery } = gifApi;
