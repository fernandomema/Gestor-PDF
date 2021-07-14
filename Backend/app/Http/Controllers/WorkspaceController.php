<?php

namespace App\Http\Controllers;

use App\Models\Workspace;
use App\Models\Document;
use Illuminate\Http\Request;
use Auth;

class WorkspaceController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $workspaces = Auth::user()->workspaces()->get();
        foreach ($workspaces as $workspace) {
            $workspace->documents = $this->documents($workspace->id);
        }
        return $workspaces;
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => ['required', 'max:191']
        ]);

        if($validatedData->validated())      return ['status' => 'success', 'msg' => 'A new worskpace has been created.'];
        else {
            $errors = $validator->errors();
            return ['status' => 'failed', 'msg' => $errors];
        }
        // Workspace::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */
    public function show(Workspace $workspace)
    {
        return view('workspaces.show', compact('workspace'));
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */
    public function edit(Workspace $workspace)
    {
        return view('workspaces.edit', compact('workspace'));
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Workspace $workspace)
    {
        $workspace->update($request->all());

        return back()->with('message', 'item updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Workspace $workspace
     * @return \Illuminate\Http\Response
     */
    public function destroy(Workspace $workspace)
    {
        $workspace->delete();

        return back()->with('message', 'item deleted successfully');
    }

    public function documents($id) {
        return Document::where('workspace_id', $id)->get();
    }
}
