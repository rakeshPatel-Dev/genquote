import { ArrowLeft, Heart, HeartCrack } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Favorite = () => {
    const [favorites, setFavorites] = useState(
        JSON.parse(localStorage.getItem("favorites")) || []
    );

    const removeFavorite = (index) => {
        const updated = favorites.filter((_, i) => i !== index);
        setFavorites(updated);
        localStorage.setItem("favorites", JSON.stringify(updated));
    };

    return (
        <div className="bg-[#f6f6f8] px-4 sm:px-10 pb-16 dark:bg-[#101622] font-display">
            <div className="layout-content-container flex flex-col max-w-[960px] mx-auto flex-1">

                <main className="flex flex-col gap-4 mt-4">

                    {/* Title + Back */}
                    <div className="flex flex-wrap justify-between items-center gap-4 px-4">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-slate-900 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">
                                My Favorite Quotes
                            </h1>
                            <p className="text-slate-500 dark:text-[#9da6b9] text-base">
                                A collection of quotes you've saved.
                            </p>
                        </div>

                        <Link
                            to="/"
                            className="group inline-flex items-center gap-2 text-black transition-all hover:underline hover:underline-offset-4 dark:text-white hover:text-[#2b6cee] font-semibold text-sm"
                        >
                            <ArrowLeft
                                className="group-hover:opacity-100 group-hover:-translate-x-2 opacity-0 transition-all"
                                size={25}
                            />
                            <span>Back to Generator</span>
                        </Link>
                    </div>

                    <section className="flex flex-col gap-4 mt-6">

                        {/* 🩶 EMPTY STATE */}
                        {favorites.length === 0 && (
                            <div className="p-4 mt-8">
                                <div className="flex flex-col items-center justify-center gap-6 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-800 p-12 text-center">
                                    <div className="flex items-center justify-center size-16 rounded-full bg-slate-200 dark:bg-slate-800">
                                        <HeartCrack />
                                    </div>
                                    <h3 className="text-slate-900 dark:text-white text-xl font-bold">
                                        No Favorites Yet
                                    </h3>
                                    <p className="text-slate-500 dark:text-[#9da6b9] text-base max-w-sm">
                                        You haven't saved any quotes. Go to the generator and click the heart icon.
                                    </p>

                                    <Link
                                        to="/"
                                        className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-[#2b6cee] text-white text-sm font-bold"
                                    >
                                        Find Quotes
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* ❤️ FAVORITE QUOTES LIST */}
                        {favorites.length > 0 && (
                            <div className="flex flex-col gap-4 px-2">
                                {favorites.map((q, i) => (
                                    <div
                                        key={i}
                                        className="flex flex-col sm:flex-row items-stretch justify-between gap-6 rounded-lg bg-white/50 dark:bg-white/5 p-6 border border-slate-200/50 dark:border-slate-800/50"
                                    >
                                        <div className="flex flex-col flex-1 gap-4">
                                            <blockquote className="text-slate-900 dark:text-white text-lg font-semibold leading-tight">
                                                "{q.content}"
                                            </blockquote>
                                            <cite className="text-slate-500 dark:text-[#9da6b9] text-sm">
                                                {q.author}
                                            </cite>
                                        </div>

                                        {/* Remove Favorite */}
                                        <button
                                            onClick={() => removeFavorite(i)}
                                            className="flex items-center justify-center size-10 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
                                        >
                                            <Heart className="fill-red-500 text-red-500" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default Favorite;
