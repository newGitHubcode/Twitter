/* eslint-disable @typescript-eslint/no-unused-vars */
// import dependencies
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AuthButtonClient from "../auth-button-client";
import GitHubButton from "./github-button";

export const dynamic = 'force-dynamic'

// main function
export default async function Login() {
    // create servercomponentclient using cookies
    const supabase = createServerComponentClient<Database>({ cookies })

    // get session from data
    const { data: { session } } = await supabase.auth.getSession()

    // if there is session we redirect
    if (session) {
        redirect("/")
    }

    // authbutton
    return (
        <div className="flex-1 flex justify-center items-center">
            <GitHubButton /> 
        </div>
        
    )
}