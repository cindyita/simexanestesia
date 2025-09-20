<?php

namespace App\Http\Controllers;

use App\Models\Resources;
use App\Models\Subjects;
use Illuminate\Support\Facades\Auth;
use App\Models\ViewRolesPermissions;
use Illuminate\Http\Request;

use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Support\Facades\Storage;

class ResourcesController extends Controller
{
    public function getResources(Request $request) {
        $perPage = $request->input('per_page', 30);
        $idCompany = session('user')['id_company'];

        //----------------------------------------------------
        $upFile = $request->input('upfile',0);

        if($upFile){
            if ($request->hasFile('file') && $request->file('file')->isValid()) {
                $file = $request->file('file');
                $extension = $file->getClientOriginalExtension();
                $nameWithoutExt = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
                $filename = $file->getClientOriginalName();

                if (Resources::where('name', $filename)->where('id_company', $idCompany)->exists()) {
                    $filename = $nameWithoutExt . "_" . time() . ".". $extension;
                }
                
                $path = $file->storeAs('resources',$filename, 'public');

                $resource = Resources::create([
                    'name'          => $filename,
                    'description'   => $request->input('description', ''),
                    'id_subject'    => $request->input('id_subject'),
                    'uploaded_by'   => Auth::id(),
                    'file_path'     => $path,
                    'file_type'     => $extension,
                    'mime_type'     => $file->getClientMimeType(),
                    'file_size'     => (int)$file->getSize(),
                    'resource_type' => 'archive',
                    'metadata'      => json_encode([
                        'size'      => $file->getSize(),
                        'extension' => $file->getClientOriginalExtension(),
                    ]),
                    'download_count'=> 0,
                    'view_count'    => 0,
                    'visibility'    => $request->input('visibility', 1),
                    'is_active'     => 1,
                    'id_company'    => $idCompany,
                ]);

            }
        }
        //----------------------------------------------------
        // ROW DELETE ----------------------------------------
        $id_delete = $request->input('id_delete');
        $url_delete = $request->input('url_delete');

        if($id_delete){
            $delete = Resources::where('id', $id_delete)->delete();
            if($delete) Storage::disk('public')->delete($url_delete);
        }
        //----------------------------------------------------
        // UPDATE FILE ---------------------------------------
        $update = $request->input('update',0);

        if($update){
            
            $resourceUpdate = Resources::find($update['id']);
            $resourceUpdate->name = $update['name'].".".$update['file_type'];
            $resourceUpdate->description = $update['description'];
            $resourceUpdate->id_subject = $update['id_subject']["id"] == 0 ? null : $update['id_subject']["id"];
            $resourceUpdate->tags = null;
            $resourceUpdate->save();
        }

        //----------------------------------------------------

        $resources = Resources::with('subject')
            ->select("id","name","file_path","file_size","created_at","file_type","mime_type","id_subject")
            ->orderBy('id', 'desc')
            ->paginate($perPage)
            ->through(function ($item) {
                $data = $item->toArray();
                $data['subject'] = $item->subject->name ?? null;
                return $data;
            });
        $subjects = Subjects::select("id","name","code")
        ->where("id_company",$idCompany)->get();

        return Inertia::render('Resources', [
            'data' => $resources,
            'subjects' => $subjects
        ]);
    }

    public function getFile(Request $request) {
        $id = $request->query('id');

         $resource = Resources::with('subject')
        ->leftJoin('sys_users', 'reg_resources.uploaded_by', '=', 'sys_users.id')
        ->where('reg_resources.id', $id)
        ->select(
            'reg_resources.*',
            'sys_users.name as uploaded_by_name'
        )
        ->first();

        if (!$resource) {
            return response()->json(['message' => 'Recurso no encontrado'], 404);
        }

        $data = $resource->toArray();
        $data['subject'] = $resource->subject->name ?? null;

        return response()->json([$data]);
    }


}

