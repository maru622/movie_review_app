import { Box, Card, CardContent, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import StarIcon from '@mui/icons-material/Star'
import ReviewForm from './ReviewForm'

export default function MovieReviews({ movieId }) {
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await fetch(
                    `http://127.0.0.1:8000/api/reviews?movie_id=${movieId}`,
                )
                const data = await response.json()
                setReviews(data)
            } catch (error) {
                console.error('Error fetching reviews:', error)
            }
        }

        fetchReviews()
    }, [movieId])

    return (
        <div
            style={{
                backgroundColor: '#FFF',
                padding: '100px',
            }}>
            <ReviewForm />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {reviews.map(review => (
                    <Card
                        key={review.id}
                        sx={{
                            maxWidth: 800,
                            margin: 'auto',
                            width: '80%',
                            p: '20px',
                        }}>
                        <CardContent>
                            <Typography variant="h6" component="div">
                                {review.user.name}
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginTop: 1,
                                }}>
                                {[...Array(review.rating)].map((_, index) => (
                                    <StarIcon
                                        key={index}
                                        color="primary"
                                        sx={{ fontSize: '30px' }}
                                    />
                                ))}
                                {[...Array(5 - review.rating)].map(
                                    (_, index) => (
                                        <StarIcon
                                            key={index}
                                            color="disabled"
                                            sx={{ fontSize: '20px' }}
                                        />
                                    ),
                                )}
                                <Typography
                                    variant="body1"
                                    sx={{ marginLeft: 1 }}>
                                    ({review.rating}/5)
                                </Typography>
                            </Box>
                            <Typography sx={{ fontSize: '20px', mt: '20px' }}>
                                {review.review_text}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ marginBottom: 1, textAlign: 'right' }}>
                                {new Date(review.created_at).toLocaleString()}{' '}
                            </Typography>
                        </CardContent>
                    </Card>
                ))}
            </Box>
        </div>
    )
}