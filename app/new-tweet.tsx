// import dependencies
import { User, createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import Image from "next/image"

export const dynamic = 'force-dynamic'

//main function
export default function NewTweet({ user }: { user:User }) {
    // function to add tweet
    const addTweet = async (formData: FormData) => {
        // a server component
        'use server'

        // the title for new tweet
        const title = String(formData.get('title'))

        // create new supabase serveractionclient 
        const supabase = createServerActionClient<Database>({ cookies });

        //insert the tweet with title, user_id 
        await supabase.from('tweets').insert({
            title, user_id: user.id
        })
    }

    // the jsx
    return (
        <>
            <form className="border-gray-800 border-t-0" action={addTweet}>
                <div className="flex py-8 px-4">
                    <div className="h-12 w-12">
                        <Image 
                            src={user.user_metadata.avatar_url}
                            alt="User avatar"
                            width={48}
                            height={48}
                            className="rounded-full"
                        />
                    </div>
                    <input name="title" className="bg-inherit flex-1 ml-2 text-2xl leading-loose placeholder-text-gray-500 px-2" placeholder="What's happening?!"/>
                </div>
            </form>
        </>
    )
}