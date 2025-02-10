<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
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
