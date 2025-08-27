<?php

namespace App\Http\Controllers;

use App\Models\Resources;
use App\Models\Subjects;
use Illuminate\Support\Facades\Auth;
use App\Models\ViewRolesPermissions;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

class ResourcesController extends Controller
{
    public function get(Request $request): Response {
        $perPage = $request->input('per_page', 30);

        $resources = Resources::with('subject')
            ->select("id","name","file_path","file_size","created_at","file_type","id_subject")
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->through(function ($item) {
                $data = $item->toArray();
                $data['subject'] = $item->subject->name ?? null;
                return $data;
            });
        $subjects = Subjects::select("id","name","code")
        ->where("id_company",session('user')['id_company'])->get();

        return Inertia::render('Resources', [
            'data' => $resources,
            'subjects' => $subjects
        ]);
    }

}

