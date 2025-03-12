import { useState, useCallback, useRef, useEffect } from 'react';
import Swal from "sweetalert2";

export type THttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface IHttpError extends Error {
    response?: {
        data?: {
            message?: string;
        };
    };
}

export type THttpClientHook = {
    isLoading: boolean;
    sendRequest: <T = unknown>(
        url: string,
        method?: THttpMethod,
        body?: BodyInit | null,
        headers?: HeadersInit
    ) => Promise<T | undefined>;
}

export const useHttpClient = (): THttpClientHook => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const activeHttpRequests = useRef<AbortController[]>([]);

    const sendRequest = useCallback(async <T = unknown>(
        url: string,
        method: THttpMethod = 'GET',
        body: BodyInit | null = null,
        headers: HeadersInit = {}
    ): Promise<T | undefined> => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            const response = await fetch(url, {
                method,
                body,
                headers,
                signal: httpAbortCtrl.signal
            });

            // Remove this controller from active requests
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            // Get the data
            const responseData = await response.json() as T;

            // Check for HTTP error status
            if (!response.ok) {
                throw new Error((responseData as any)?.error || 'An unknown error occurred');
            }

            setIsLoading(false);
            return responseData;
        } catch (err) {
            setIsLoading(false);

            // Type guard for the error
            const error = err as IHttpError;
            console.error(error);

            // Only show errors that are not related to navigation or auth redirects
            if (
                (error.message !== 'Login First' &&
                    error.message !== 'The user aborted a request.') ||
                (error.response?.data?.message)
            ) {
                Swal.fire({
                    title: 'Error!',
                    text: error.message || 'An unknown error occurred',
                    icon: 'error',
                });
            }

            throw error; // Rethrow to allow caller to handle
        }
    }, []);

    useEffect(() => {
        // Cleanup function to abort ongoing requests when component unmounts
        return () => {
            if (import.meta.env?.NODE_ENV === "production") {
                activeHttpRequests.current.forEach(abortCtrl => abortCtrl.abort());
            }
        };
    }, []);

    return { isLoading, sendRequest };
};
