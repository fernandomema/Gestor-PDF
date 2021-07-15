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
        /* Validación del nombre de workspace */
        $validatedData = $request->validate([
            'name' => ['required', 'max:191']
        ]);

        if($validatedData->errors()){
            /* ---------------- Inserción de registro en tabla workspaces --------------- */
            // Creamos un nuevo registro en el modelo Workspace...
            $workspace = new Workspace();

            // y asignamos en el campo 'name' el nombre
            $workspace->name = $request->name;

            // Guardamos el nuevo registro Workspace
            $workspace->save();

            /* ---------------- Inserción de registro en tabla PIVOTE user_workspace --------------- */
            // Obtenemos el usuario actual autenticado
            $user = Auth::user();

            // Insertamos un nuevo registro en la tabla pivote
            $user->workspaces()->attach($workspace->id);

            return ['status' => 'success', 'msg' => 'A new worskpace has been created.'];
        }      
        else {
            $errors = $validator->errors();
            return ['status' => 'failed', 'msg' => $errors];
        }
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
        /* ------- Validación del nombre del Workspace ------- */
        $validatedData = $request->validate([
            'name' => ['required', 'max:191']
        ]);
        if($validatedData->validated()){
            $workspace->name = $request->name;
            return ['status' => 'success', 'msg' => 'The worskpace has been updated.'];
        } else{
            $errors = $validator->errors();
            return ['status' => 'failed', 'msg' => $errors];
        }
        $workspace->update($request->all());

        // return back()->with('message', 'item updated successfully');
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
