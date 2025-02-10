import AppLayout from '@/components/Layouts/AppLayout'
import laravelApiClient from '@/lib/laravelApiClient'
import Head from 'next/head'
import React from 'react'
import useSWR from 'swr'

function like() {
    const fetcher = url => laravelApiClient.get(url).then(res => res.data)
    const { data: likeItems, error } = useSWR('api/likes', fetcher)

    if (error) {
        return <div>エラーが発生しました</div>
    }

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Like
                </h2>
            }>
            <Head>
                <title>Like - CinemaLoveReview</title>
            </Head>
            <div>いいね一覧</div>
        </AppLayout>
    )
}

export default like