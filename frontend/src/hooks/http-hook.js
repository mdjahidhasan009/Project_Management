import { useState, useCallback, useRef, useEffect } from 'react';
import M from "materialize-css";

export const useHttpClient = () => {
    const [ isLoading, setIsLoading ] = useState(true);

    const activeHttpRequests = useRef([]);

    const sendRequest = useCallback(async (url, method = 'GET', body = null, headers = {}) => {
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
            //As current request is successfully done now we can remove from the active http request list.
            activeHttpRequests.current = activeHttpRequests.current.filter(
                reqCtrl => reqCtrl !== httpAbortCtrl
            );
            //as 400 and 500 errors does not treat as an error by default but in our case it is an error and manually
           //throwing an error
           if(!response.ok) throw new Error(responseData.error);

            setIsLoading(false);
            return responseData;
        } catch (error) {
             setIsLoading(false);
             console.log(error)
             if((error.message !== 'Login First' && //as 401
                 //Http request abort only happen when user go other page(very quickly) before completing the http request
                 //so no need to show this as an error
                 error.message !== 'The user aborted a request.') ||

                 (error.response &&
                 error.response.data &&
                 error.response.data.message
                )
             ) {
               M.toast({ html: error.message, classes: 'red' });
             }
        }
    }, []);


    useEffect(() => {
        //this runs as cleanup function before next time useEffect run or also when a component use useEffect unmount
        return () => {
            //if http request is not finished but the component which called it will be unmounted then we can cancel the
            //running request as we do not need this now.
            activeHttpRequests.current.forEach(aboutCtr => aboutCtr.abort());
        }
    }, []);

    return { isLoading, sendRequest };
}
