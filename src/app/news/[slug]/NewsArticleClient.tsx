"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, ExternalLink, Share2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { NewsItem } from "@/types/project";

interface NewsArticleClientProps {
  item: NewsItem;
  relatedItems: NewsItem[];
}

export default function NewsArticleClient({ item, relatedItems }: NewsArticleClientProps) {
  const [shareFeedback, setShareFeedback] = useState("");

  const handleShare = async () => {
    const shareData = {
      title: item.title,
      text: item.excerpt,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareFeedback("Shared");
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setShareFeedback("Link copied");
      }
    } catch {
      setShareFeedback("Unable to share");
    }
  };

  return (
    <div className="min-h-screen bg-white text-black dark:bg-[#303030] dark:text-[#f5f5f5] transition-colors duration-200">
      <Header activeCategory="architecture" />

      <main className="px-5 pb-20 pt-[100px] font-body sm:px-8 md:pt-[120px] lg:px-16">
        <article className="mx-auto max-w-[1320px]">
          <Link href="/news" className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            All dispatches
          </Link>

          <header className="mb-8 max-w-4xl">
            <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              <span>{item.category}</span>
              <span aria-hidden="true">/</span>
              <span>{item.readTime}</span>
            </div>
            <h1 className="font-display text-3xl font-normal leading-tight text-black dark:text-white sm:text-4xl md:text-5xl lg:text-6xl">
              {item.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-neutral-600 dark:text-neutral-400">
              <span><span className="text-neutral-400 dark:text-neutral-500">Published</span> {item.date}</span>
              <span><span className="text-neutral-400 dark:text-neutral-500">By</span> {item.author || "Plane Architect"}</span>
            </div>
          </header>

          <div className="relative aspect-[16/9] max-h-[72vh] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
            <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
          </div>

          <section className="grid gap-8 border-b border-neutral-200 dark:border-white/10 py-8 md:grid-cols-[minmax(180px,0.45fr)_1fr] md:gap-16 md:py-10">
            <div className="flex items-start gap-3">
              <button
                type="button"
                onClick={handleShare}
                aria-label="Share this article"
                className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-300 dark:border-white/20 text-black dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                title="Share article"
              >
                {shareFeedback === "Shared" || shareFeedback === "Link copied" ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <Share2 className="h-5 w-5" />
                )}
              </button>
              {item.sourceUrl && (
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Open original publication"
                  title="Open original publication"
                  className="flex h-11 w-11 shrink-0 items-center justify-center border border-neutral-300 dark:border-white/20 text-black dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <ExternalLink className="h-5 w-5" />
                </a>
              )}
              {shareFeedback && <span role="status" className="self-center text-xs text-neutral-500 dark:text-neutral-400">{shareFeedback}</span>}
            </div>
            <div className="max-w-3xl space-y-6">
              <p className="font-display text-xl leading-relaxed text-neutral-900 dark:text-neutral-100 sm:text-2xl md:text-3xl font-light">
                {item.excerpt}
              </p>

              {item.body && (
                <div className="mt-8 space-y-6 pt-6 border-t border-neutral-100 dark:border-white/10 font-body text-base md:text-lg leading-relaxed font-light text-neutral-700 dark:text-neutral-300">
                  {item.body.split("\n\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              )}
            </div>
          </section>
        </article>

        {relatedItems.length > 0 && (
          <section aria-labelledby="more-dispatches" className="mx-auto mt-16 max-w-[1320px]">
            <div className="mb-6 flex items-end justify-between border-b border-neutral-200 dark:border-white/10 pb-4">
              <div>
                <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">Continue reading</p>
                <h2 id="more-dispatches" className="font-display text-2xl font-normal text-black dark:text-white sm:text-3xl">More dispatches</h2>
              </div>
              <Link href="/news" aria-label="View all news" className="flex h-10 w-10 items-center justify-center border border-neutral-300 dark:border-white/20 text-black dark:text-white transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedItems.map((relatedItem) => (
                <Link key={relatedItem.id} href={`/news/${relatedItem.slug}`} className="group">
                  <div className="mb-4 aspect-[16/10] overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                    <img src={relatedItem.image} alt={relatedItem.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                  <p className="mb-2 text-[10px] uppercase tracking-wider text-neutral-500 dark:text-neutral-400">{relatedItem.date} / {relatedItem.category}</p>
                  <h3 className="font-display text-lg leading-snug text-black dark:text-white group-hover:opacity-70">{relatedItem.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}