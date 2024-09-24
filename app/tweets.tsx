/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import Likes from "./likes";
import { useOptimistic, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation"
import Image from "next/image";

export default function Tweets({ tweets }: { tweets: TweetWithAuthor[] }) {

  const [optimisticTweets, addOptimisticTweets] = useOptimistic<TweetWithAuthor[], TweetWithAuthor>(tweets, (currentOptimisticTweets, newTweet) => {

    const newOptimisticTweets = [...currentOptimisticTweets];
    const index = newOptimisticTweets.findIndex(tweet => tweet.id === newTweet.id);

    newOptimisticTweets[index] = newTweet;
    return newOptimisticTweets;
  })

  const supabase = createClientComponentClient();
  const router = useRouter()

  useEffect(() => {
    const channel = supabase
      .channel("realtime tweets")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "tweets",
        },
        (payload) => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, router])

  return optimisticTweets.map(tweet => (
    <div key={tweet.id} className="border border-gray-800 border-t-0 px-4 py-8 flex">
      <div className="rounded-full">
        <Image 
          src={tweet.author.avatar_url}
          alt="User avatar"
          width={48}
          height={48}
        />
      </div>

      <div className="ml-4"> 
        <p>
          <span className="font-bold">{tweet.author.name}</span>
          <span className=" text-sm ml-2 text-gray-400">{tweet.author.username}</span>
        </p>

        <p>{tweet.title}</p>

        <Likes tweet={tweet} addOptimisticTweet={addOptimisticTweets} />
      </div>

    </div>
  ))
}