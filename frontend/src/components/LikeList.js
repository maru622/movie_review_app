import { useEffect, useState } from 'react'
import laravelApiClient from '@/lib/laravelApiClient'
import useSWR from 'swr'

function LikeList() {
    const fetcher = url => laravelApiClient.get(url).then(res => res.data)
    const { data: likeItems, error } = useSWR('/api/likes', fetcher)
    const [movies, setMovies] = useState([])

    useEffect(() => {
        if (likeItems) {
            const fetchMovies = async () => {
                const moviePromises = likeItems.map(item =>
                    fetch(
                        `https://api.themoviedb.org/3/movie/${item.movie_id}?api_key=YOUR_TMDB_API_KEY&language=ja-JP`
                    ).then(res => res.json())
                )
                const moviesData = await Promise.all(moviePromises)
                setMovies(moviesData)
            }
            fetchMovies()
        }
    }, [likeItems])

    if (error) return <div>エラーが発生しました</div>
    if (!likeItems || !movies.length) return <div>読み込み中...</div>

    return (
        <div>
            {movies.map(movie => (
                <div key={movie.id}>
                    <h3>{movie.title}</h3>
                    <p>{movie.overview}</p>
                </div>
            ))}
        </div>
    )
}