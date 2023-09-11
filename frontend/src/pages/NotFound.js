import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import notFoundAnimation from '../assets/gif/404.json';
import LottieAnimation from '../components/LottieAnimation';

function NotFound(props) {
    const history = useHistory();

    useEffect(() => {
        const redirectTimeout = setTimeout(() => {
            history.push('/');
        }, 10000);

        return () => {
            clearTimeout(redirectTimeout);
        };
    }, [history]);

    return (
        <div className="bg-default min-h-screen p-6 flex flex-col items-center justify-center lg:space-y-10 md:space-y-8 space-y-4 text-indigo-100 overscroll-none">
            <LottieAnimation animationData={notFoundAnimation} />

            <Link
                to="/"
                className="flex items-center justify-center lg:w-60 md:w-32 w-28 lg:h-12 md:h-10 h-8 lg:text-xl md:text-l text-m ring-2 ring-orange-500 rounded-full hover:bg-orange-500 transition-all duration-200 hover:px-5 cursor-pointer"
            >
                Back to Home
            </Link>
        </div>
    );
}

export default NotFound;
