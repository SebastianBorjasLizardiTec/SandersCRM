import { fetchUtils, DataProvider } from 'react-admin';
import { stringify } from 'query-string';
import { API_URL } from '../constants/constants';

const httpClient = fetchUtils.fetchJson;

export const dataProvider: DataProvider = {
    getList: (resource: string) => {
        const url = `${API_URL}/${resource}`;
        return httpClient(url).then(({ json }) => ({
            data: json,
            total: json.length, 
        }));
    },

    getOne: (resource: string, params: { id: string | number }) =>
        httpClient(`${API_URL}/${resource}/${params.id}`).then(({ json }) => ({
            data: json,
        })),

    getMany: (resource: string, params: { ids: (string | number)[] }) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        const url = `${API_URL}/${resource}?${stringify(query)}`;
        return httpClient(url).then(({ json }) => ({ data: json }));
    },

    getManyReference: (resource: string, params: {
        target: string;
        id: string | number;
        pagination: { page: number; perPage: number };
        sort: { field: string; order: string };
        filter: Record<string, unknown>;
    }) => {
        const { page, perPage } = params.pagination;
        const { field, order } = params.sort;
        const query = {
            sort: JSON.stringify([field, order]),
            range: JSON.stringify([(page - 1) * perPage, page * perPage - 1]),
            filter: JSON.stringify({
                ...params.filter,
                [params.target]: params.id,
            }),
        };
        const url = `${API_URL}/${resource}?${stringify(query)}`;

        return httpClient(url).then(({ headers, json }) => ({
            data: json,
            total: parseInt(headers.get('content-range')?.split('/').pop() ?? '0', 10),
        }));
    },

    create: (resource: string, params: { data: Record<string, unknown> }) =>
        httpClient(`${API_URL}/${resource}`, {
            method: 'POST',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({
            data: { ...params.data, ...json },
        })),

    update: (resource: string, params: { id: string | number; data: Record<string, unknown> }) =>
        httpClient(`${API_URL}/${resource}/${params.id}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json })),

    updateMany: (resource: string, params: { ids: (string | number)[]; data: Record<string, unknown> }) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${API_URL}/${resource}?${stringify(query)}`, {
            method: 'PUT',
            body: JSON.stringify(params.data),
        }).then(({ json }) => ({ data: json }));
    },

    delete: (resource: string, params: { id: string | number }) =>
        httpClient(`${API_URL}/${resource}/${params.id}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json })),

    deleteMany: (resource: string, params: { ids: (string | number)[] }) => {
        const query = {
            filter: JSON.stringify({ id: params.ids }),
        };
        return httpClient(`${API_URL}/${resource}?${stringify(query)}`, {
            method: 'DELETE',
        }).then(({ json }) => ({ data: json }));
    },
};
