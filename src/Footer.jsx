import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
    return (
        <div className=' relative bottom-0 border-t border-solid border-white/10 bg-[#f6f6f8] dark:bg-[#101622]'>
            <footer className=" max-w-6xl  mx-auto flex flex-col sm:flex-row items-center justify-center whitespace-nowrap  px-4 sm:px-10 py-4 gap-4">
                <p className="text-white text-sm">
                    &copy; 2024 GenQuote. All rights reserved.
                </p>
                {/* developer */}
                <p className="text-white text-sm">
                    Developed by{" "}
                    <a
                        href="https://rakeshthedev.netlify.app"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline hover:text-blue-400"
                    >
                        Rakesh Patel
                    </a>
                </p>


            </footer>
        </div>
    )
}

export default Footer
