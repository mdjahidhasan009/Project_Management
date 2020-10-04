import { useState, useCallback, useRef, useEffect } from 'react';
import M from "materialize-css";

export const useHttpClient = () => {
    const [ isLoading, setIsLoading ] = useState(false);

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
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
            const responseData = await response.json();
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );

            if(!response.ok) {
                throw new Error(responseData.error);
            }

            setIsLoading(false);
            return responseData;
        } catch (e) {
            console.log(e);
             M.toast({html: e.message, classes: 'red'});
            setIsLoading(false);
            throw e;
        }
    }, []);


    useEffect(() => {
        //this runs as cleanup function before next time useEffect run or also when an component use useEffect unmount
        return () => {
            activeHttpRequests.current.forEach(aboutCtr => aboutCtr.abort());
        }
    }, []);

    return { isLoading, sendRequest };
}
