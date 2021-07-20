<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Workspace;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use File;

use LSNepomuceno\LaravelA1PdfSign\{ManageCert, SignaturePdf};

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
            Storage::disk('sftp')->put('pdf/'.$filename.'.pdf', $request->file->get());
            $document = new Document;
            $document->name = $file->getClientOriginalName();
            $document->type = "document";
            $document->document = 'pdf/'.$filename.'.pdf'; 
            $document->data = "{}";
            $document->workspace_id = $request->input('workspace');
            $document->save();
            array_push($documents, $document);
        }
        return ['status' => 'ok', 'documents' => $documents];
    }

    public function sign(Request $request) {
        $certificate;
        $pdf;
        $resource;

        $document = Document::find($request->document);
        $filename = $document->name;
        $timestamp = time();

        if ($request->input('workspace') == null) {
            return ['status' => 'failed', 'msg' => 'Invalid workspace_id.'];
        }


        // Get certificate from file
        try {
            global $certificate;
            $certificate = new ManageCert;
            $certificate->fromUpload($request->pfx, ($request->password ?: ''));
            //dd($certificate->getCert());
        } catch (\Throwable $th) {
            return ['status' => 'failed', 'msg' => 'certificate file cound not been processed', 'data' => $th->getMessage()];
        }

        // Returning signed resource string
        try {
            global $certificate;
            global $pdf;
            global $resource;
            // Copy file from sftp disk to tmp disk
            Storage::disk('tmp')->put($document->document, Storage::disk('sftp')->get($document->document));
            $pdf = new SignaturePdf(Storage::disk('tmp')->path($document->document), $certificate, SignaturePdf::MODE_RESOURCE); // Resource mode is default
            $resource = $pdf->signature();
            // TODO necessary
        } catch (\Throwable $th) {
            if (Storage::disk('tmp')->exists($document->document)) {
                Storage::disk('tmp')->delete($document->document);
            }
            return ['status' => 'failed', 'msg' => 'Error signing pdf', 'data' => $th->getMessage(), 'tmp file' => Storage::disk('tmp')->path($document->document)];
        }
        
        $unique = uniqid();
        Storage::disk('tmp')->delete($document->document);
        Storage::disk('sftp')->put('pdf/'.$unique.'.pdf', $resource);
        $document = new Document;
        $document->name = $filename.'-generated';
        $document->type = "document";
        $document->document = 'pdf/'.$unique.'.pdf'; 
        $document->data = "{}";
        $document->workspace_id = $request->input('workspace');
        $document->save();
        
        return ['status' => 'success', 'document' => $document->id];
    }

    public function file(Request $request) {
        $document = Document::find($request->id);
        return Storage::disk('sftp')->download($document->document, $document->name.'.pdf', [
            'Content-Disposition' => 'inline'
        ], 'inline');
    }
}
