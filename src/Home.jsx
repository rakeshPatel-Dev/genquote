import axios from "axios";
import { ArrowRight, Copy, Facebook, Heart, Search, Share2, X, ChevronLeft, ChevronRight } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Home = () => {
    const [quotesList, setQuotesList] = useState(JSON.parse(localStorage.getItem("quotesBatch")) || []);
    const [currentQuote, setCurrentQuote] = useState(quotesList[0] || { content: "", author: "", tags: [] });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(quotesList.length === 0);
    const [showModal, setShowModal] = useState(false);
    const [modalIndex, setModalIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);
    const [favorites, setFavorites] = useState(JSON.parse(localStorage.getItem("favorites")) || []);

    console.log(favorites);
    // Tooltip button
    const IconButtonWithTooltip = ({ label, onClick, children }) => (
        <div className="relative group">
            <button
                onClick={onClick}
                aria-label={label}
                className="hover:animate-pulse cursor-pointer size-12 flex items-center justify-center rounded-full p-3
          bg-white/10 dark:bg-black/20 text-white/70 dark:text-white/80
          hover:bg-white/20 dark:hover:bg-black/30 transition-colors"
            >
                {children}
            </button>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-2 py-1 
          bg-black/80 dark:bg-white/90 text-white dark:text-black text-xs 
          rounded-md opacity-0 pointer-events-none transform translate-y-2
          transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
                {label}
                <div className="absolute left-1/2 top-full -translate-x-1/2 
            w-2 h-2 bg-black/80 dark:bg-white/90 rotate-45" />
            </div>
        </div>
    );

    // Fetch quotes batch (background fetch)
    const fetchQuotesBatch = async () => {
        try {
            setLoading(true);
            const promises = Array.from({ length: 40 }, () => axios.get("https://api.quotable.io/random"));
            const results = await Promise.all(promises);
            const batch = results.map(r => r.data);
            setQuotesList(batch);
            localStorage.setItem("quotesBatch", JSON.stringify(batch));
            setLoading(false);
            // Set random quote if initial was empty
            if (!currentQuote.content) setCurrentQuote(batch[Math.floor(Math.random() * batch.length)]);
        } catch (err) {
            console.error(err);
            setLoading(false);
            toast.error("Failed to load quotes");
        }
    };

    useEffect(() => {
        // Only fetch if no quotes are cached
        if (quotesList.length === 0) fetchQuotesBatch();
    }, []);

    // Favorites
    const addToFavorites = (quote) => {
        const exists = favorites.some(f => f.content === quote.content && f.author === quote.author);
        if (!exists) {
            const newFavs = [...favorites, quote];
            setFavorites(newFavs);
            localStorage.setItem("favorites", JSON.stringify(newFavs));
            toast.success("Added to favorites!");
        } else {
            toast("Already in favorites!");
        }
    };

    // Generate new quote
    const generateNewQuote = () => {
        const randomQuote = quotesList[Math.floor(Math.random() * quotesList.length)];
        setCurrentQuote(randomQuote);
    };

    // Copy & share
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => toast.success("Quote copied!")).catch(() => toast.error("Failed to copy"));
    };
    const shareQuote = () => {
        const text = `"${currentQuote.content}" — ${currentQuote.author}`;
        navigator.share?.({ text }) || toast("Share not supported on this device");
    };
    const shareOnFacebook = () => {
        const text = `"${currentQuote.content}" — ${currentQuote.author}`;
        const url = `https://www.facebook.com/sharer/sharer.php?u=&quote=${encodeURIComponent(text)}`;
        navigator.clipboard.writeText(text);
        setTimeout(() => window.open(url, "_blank"), 500);
        toast("Quote copied! Paste it into Facebook post.", { icon: "✍️" });
    };

    // Filter quotes
    const filteredQuotes = quotesList.filter(
        q =>
            q.content.toLowerCase().includes(search.toLowerCase()) ||
            q.author.toLowerCase().includes(search.toLowerCase()) ||
            q.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    );

    // Modal navigation
    const openModal = (index) => { setModalIndex(index); setShowModal(true); };
    const closeModal = () => setShowModal(false);
    const nextModal = () => setModalIndex((modalIndex + 1) % filteredQuotes.length);
    const prevModal = () => setModalIndex((modalIndex - 1 + filteredQuotes.length) % filteredQuotes.length);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e) => {
            if (!showModal) return;
            if (e.key === "ArrowLeft") prevModal();
            if (e.key === "ArrowRight") nextModal();
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [showModal, modalIndex, filteredQuotes]);

    // Swipe navigation
    useEffect(() => {
        if (!showModal) return;
        let startX = 0;
        const handleTouchStart = (e) => startX = e.touches[0].clientX;
        const handleTouchEnd = (e) => {
            const endX = e.changedTouches[0].clientX;
            if (startX - endX > 50) nextModal();
            if (endX - startX > 50) prevModal();
        };
        window.addEventListener("touchstart", handleTouchStart);
        window.addEventListener("touchend", handleTouchEnd);
        return () => {
            window.removeEventListener("touchstart", handleTouchStart);
            window.removeEventListener("touchend", handleTouchEnd);
        };
    }, [showModal, modalIndex, filteredQuotes]);

    return (
        <div className="relative flex w-full flex-col bg-[#f6f6f8] dark:bg-[#101622] overflow-hidden min-h-screen">
            <main className="flex flex-col items-center justify-center py-8 px-6 sm:px-10 w-full">
                <div className="w-full max-w-3xl flex flex-col items-center gap-8 text-center">

                    {/* Search */}
                    <div className="w-full flex flex-col items-center gap-3">
                        <div className="relative w-full max-w-xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" />
                            <input
                                type="search"
                                placeholder="Search quotes, authors, or tags..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/5 text-white/80 border border-white/10 
                focus:ring-2 focus:ring-[#2b6cee] focus:outline-none placeholder:text-white/50"
                            />
                        </div>
                    </div>

                    {/* Current Quote */}
                    <div className="relative w-full flex items-start gap-4 pr-4">
                        {loading && (
                            <div className="absolute inset-0 flex items-center justify-center rounded-lg">
                                <div className="loader ease-linear rounded-full border-4 border-t-4 border-white/50 h-8 w-8 animate-spin"></div>
                            </div>
                        )}
                        <h1 className="flex-1 px-4 text-white/90 font-serif-display tracking-normal text-xl sm:text-2xl font-medium leading-tight">
                            {`"${currentQuote.content}"`}
                        </h1>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-white/60 text-xl md:text-2xl font-bold tracking-tight px-4 pt-2">- {currentQuote.author}</h2>
                        <p className="text-white/60 text-sm tracking-tight">-- {currentQuote.tags.join(", ")} --</p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col items-center gap-6 w-full px-4">
                        <button
                            onClick={generateNewQuote}
                            className="h-12 px-8 rounded-lg bg-[#2b6cee] text-white font-bold active:scale-95 cursor-pointer transition-all tracking-wide hover:bg-[#2b6cee]/90 max-w-[480px]"
                        >
                            Generate New Quote
                        </button>

                        <div className="flex items-center gap-4">
                            <IconButtonWithTooltip label="Add to Favorites" onClick={() => addToFavorites(currentQuote)}><Heart /></IconButtonWithTooltip>
                            <IconButtonWithTooltip label="Copy Quote" onClick={() => copyToClipboard(`"${currentQuote.content}" — ${currentQuote.author}`)}><Copy /></IconButtonWithTooltip>
                            <IconButtonWithTooltip label="Share this Quote" onClick={shareQuote}><Share2 /></IconButtonWithTooltip>
                            <IconButtonWithTooltip label="Share on Facebook" onClick={shareOnFacebook}><Facebook /></IconButtonWithTooltip>
                        </div>
                    </div>

                    {/* Favorite Quotes Link */}
                    <Link
                        to="/favorite"
                        className="ml-4 group flex gap-2 flow-row items-center hover:text-[#2b6cee] text-white hover:underline hover:underline-offset-4 font-semibold rounded-lg select-none transition-all cursor-pointer px-4"
                    >
                        <h1>Favorite Quotes</h1>
                        <ArrowRight className="group-hover:opacity-100 group-hover:translate-x-2 group-active:translate-0 opacity-0 transition-all" size={20} />
                    </Link>

                    {/* Filtered Quotes List */}
                    {search && (
                        <div className="w-full max-w-3xl flex flex-col gap-3 mt-4">
                            {(showAll ? filteredQuotes : filteredQuotes.slice(0, 5)).map((q, i) => (
                                <div
                                    key={i}
                                    className="p-4 bg-white/10 rounded-lg text-white cursor-pointer hover:bg-white/20 transition-colors"
                                    onClick={() => openModal(i)}
                                >
                                    "{q.content}" — {q.author} [{q.tags.join(", ")}]
                                </div>
                            ))}

                            {filteredQuotes.length > 5 && (
                                <button
                                    onClick={() => setShowAll(!showAll)}
                                    className="mt-2 px-4 py-2 rounded-lg bg-[#2b6cee] text-white font-semibold hover:bg-[#2b6cee]/90 transition-colors"
                                >
                                    {showAll ? "Show Less" : "Show More"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* Modal */}
            {showModal && filteredQuotes[modalIndex] && (
                <div className="fixed inset-0 z-50 px-6 flex items-center justify-center bg-black/70">
                    <div className="relative bg-[#1c1c2a] text-white rounded-xl px-6 py-10 max-w-lg w-full">
                        <button onClick={closeModal} className="absolute top-3 right-3 p-2 rounded-full hover:bg-white/20"><X /></button>

                        <h1 className="text-xl sm:text-2xl font-semibold mb-4">"{filteredQuotes[modalIndex].content}"</h1>
                        <h2 className="text-lg font-bold mb-2">- {filteredQuotes[modalIndex].author}</h2>
                        <p className="text-sm mb-4">-- {filteredQuotes[modalIndex].tags.join(", ")} --</p>

                        <div className="flex items-center gap-4 mb-4">
                            <IconButtonWithTooltip
                                label="Copy Quote"
                                onClick={() => copyToClipboard(`"${filteredQuotes[modalIndex].content}" — ${filteredQuotes[modalIndex].author}`)}
                            ><Copy /></IconButtonWithTooltip>
                            <IconButtonWithTooltip
                                label="Share this Quote"
                                onClick={() => {
                                    const text = `"${filteredQuotes[modalIndex].content}" — ${filteredQuotes[modalIndex].author}`;
                                    navigator.share?.({ text }) || toast("Share not supported");
                                }}
                            ><Share2 /></IconButtonWithTooltip>
                            <IconButtonWithTooltip
                                label="Share on Facebook"
                                onClick={() => {
                                    const text = `"${filteredQuotes[modalIndex].content}" — ${filteredQuotes[modalIndex].author}`;
                                    const url = `https://www.facebook.com/sharer/sharer.php?u=&quote=${encodeURIComponent(text)}`;
                                    navigator.clipboard.writeText(text);
                                    setTimeout(() => window.open(url, "_blank"), 500);
                                    toast("Quote copied! Paste it into Facebook post.", { icon: "✍️" });
                                }}
                            ><Facebook /></IconButtonWithTooltip>
                        </div>

                        {/* Modal navigation */}
                        <div className="flex justify-between mt-4">
                            <button onClick={prevModal} className="p-2 rounded-full hover:bg-white/20"><ChevronLeft /></button>
                            <button onClick={nextModal} className="p-2 rounded-full hover:bg-white/20"><ChevronRight /></button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Home;
