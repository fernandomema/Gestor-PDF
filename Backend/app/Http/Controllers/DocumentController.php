<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use File;

class DocumentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $documents = Document::all();
        foreach ($documents as $document) {
            $document->workspace = Workspace::find($document->workspace_id);
        }

        return $documents;
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        Document::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Document $document
     * @return \Illuminate\Http\Response
     */
    public function show(Document $document)
    {
        return $document;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Document $document
     * @return \Illuminate\Http\Response
     */
    public function edit(Document $document)
    {
        return $document;
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Document $document
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Document $document)
    {
        $document->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Document $document
     * @return \Illuminate\Http\Response
     */
    public function destroy(Document $document)
    {
        $document->delete();
    }

    public function upload(Request $request) {
        $documents = [];
        foreach($request->file('pdf') as $file) {
            $filename = uniqid().File::extension($file->getClientOriginalName());
            Storage::disk('sftp')->put('pdf/'.$filename.'.pdf', $request->file);
            $document = new Document;
            $document->name = $file->getClientOriginalName();
            $document->type = "template";
            $document->document = 'pdf/'.$filename.'.pdf'; 
            $document->data = "{}";
            $document->workspace_id = $request->input('workspace');
            $document->save();
            array_push($documents, $document);
        }
        return ['status' => 'ok', 'documents' => $documents];
    }
}
