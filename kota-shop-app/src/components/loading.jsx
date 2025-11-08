import React from 'react'
import spinner from '@/assets/images/spin.gif'

function Loading() {
    return (
        <>
            <div className="grid grid-cols-[1fr] grid-rows-[1fr] items-center justify-items-center min-h-screen">
                <img src={spinner} alt="Loading..." />
            </div>
        </>
    )
};

export default Loading
