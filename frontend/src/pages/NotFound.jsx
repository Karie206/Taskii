import React from 'react';

const NotFound = () => {
    return (
        <div className="flex flex-col justify-center items-center w-screen min-h-screen text-center bg-slate-50">
            <img src="404_NotFound.png" alt="not-found" className="max-w-full mb-6 w-96 transition-all duration-500 ease-in-out hover:scale-105 animate-float" />
            <p className="text-xl font-semibold">Oops! It seems the page you're looking for doesn't exist.</p>

            <a href="/" className="inline-block px-6 py-3 mt-6 font-medium text-white transition shadow-md bg-primary rounded-2xl hover:bg-primary-dark hover:-translate-y-2 duration-500 ease-in-out cursor-pointer">Back to Home</a>
        </div>
    );
};

export default NotFound;