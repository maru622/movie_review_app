<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;

class LikeController extends Controller
{
    public function index()
    {
        $api_key = config('services.tmdb.api_key');
        $user = Auth::user();

        // ユーザーが未認証の場合は適切に処理する
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $likes = $user->likes;
        $movieDetails = [];

        foreach ($likes as $like) {
            $tmdb_api_url = "https://api.themoviedb.org/3/movie/" . $like->movie_id . "?api_key=" . $api_key;

            try {
                $response = Http::get($tmdb_api_url);

                if ($response->successful()) {
                    $movieDetails[] = $response->json();
                } else {
                    Log::warning("TMDB API request failed for movie_id {$like->movie_id}. Status: " . $response->status());
                }
            } catch (\Exception $e) {
                Log::error("Error fetching movie details for movie_id {$like->movie_id}: " . $e->getMessage());
            }
        }

        // 映画情報をJSON形式で返します
        return response()->json($movieDetails);
    }

    public function toggleLike(Request $request) {
        $validatedData = $request->validate([
            'movie_id' => 'required|integer',
        ]);

        $like = Like::where('user_id', Auth::id())
        ->where('movie_id', $validatedData['movie_id'])
        ->first();

        if ($like) {
            $like->delete();
            return response()->json(['status' => 'removed']);
        } else {
            Like::create([
                'movie_id' => $validatedData['movie_id'],
                'user_id' => Auth::id(),
            ]);
            return response()->json(['status' => 'added']);
        }
    }

    public function checkLikeStatus(Request $request) {
        $validatedData = $request->validate([
            'movie_id' => 'required|integer',
        ]);

        $isLike = Like::where('user_id', Auth::id())
        ->where('movie_id', $validatedData['movie_id'])
        ->exists();

        return response()->json($isLike);
    }
}
