// client component
'use client'

// import dependencies
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { useRouter } from "next/navigation"

//main function
export default function Likes({ tweet, addOptimisticTweet }: { tweet: TweetWithAuthor; addOptimisticTweet: (newTweet: TweetWithAuthor) => void }) {
    //router for refresh every time like
    const router = useRouter()

    // onClick function
    const handleLikes = async () => {
        // make a supabase client
        const supabase = createClientComponentClient<Database>()

        // get the user
        const { data: { user } } = await supabase.auth.getUser()

        // check if there is user
        if (user) {
            // check if user already liked the tweet
            if (tweet.user_has_liked_tweet) {
                addOptimisticTweet({
                    ...tweet,
                    likes: tweet.likes - 1,
                    user_has_liked_tweet: !tweet.user_has_liked_tweet
                })

                // if yes delete the like
                await supabase.from('likes').delete().match({ user_id: user.id, tweet_id: tweet.id });
            } else {
                addOptimisticTweet({
                    ...tweet,
                    likes: tweet.likes + 1,
                    user_has_liked_tweet: !tweet.user_has_liked_tweet
                })
                // else we add the like
                await supabase.from('likes').insert({ user_id: user.id, tweet_id: tweet.id });
            }

            // refresh
            router.refresh()
        }
    }

    // the button
    return (
        <button onClick={handleLikes} className="group flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`group-hover:fill-red-600 group-hover:stroke-red-600 ${tweet.user_has_liked_tweet ? 'fill-red-600 stroke-red-600' : 'fill-none stroke-gray-500'}`}><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            <span className={`ml-2 text-sm group-hover:text-red-600 ${tweet.user_has_liked_tweet ? 'text-red-600' : 'text-gray-500'}`}>{tweet.likes}</span>
        </button>
    )
}