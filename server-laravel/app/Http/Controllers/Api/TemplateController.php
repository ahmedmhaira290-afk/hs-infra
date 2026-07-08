<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use App\Models\Template;
use Illuminate\Http\Request;

class TemplateController extends Controller
{
    public function index(Request $request)
    {
        if ($request->boolean('active')) {
            return response()->json(Template::where('is_active', true)->orderBy('id')->get());
        }
        return response()->json(Template::orderBy('id')->get());
    }

    public function show($id)
    {
        return response()->json(Template::findOrFail($id));
    }

    public function store(Request $request)
    {
        $template = Template::create($request->all());
        ActionLog::create(['user_id' => $request->user()->id, 'action' => 'template_created', 'target_type' => 'template', 'target_id' => $template->id, 'details' => $template->title]);
        return response()->json($template, 201);
    }

    public function update(Request $request, $id)
    {
        $template = Template::findOrFail($id);
        $old = $template->title;
        $template->update($request->all());
        ActionLog::create(['user_id' => $request->user()->id, 'action' => 'template_updated', 'target_type' => 'template', 'target_id' => $template->id, 'details' => $old]);
        return response()->json($template);
    }

    public function destroy(Request $request, $id)
    {
        $template = Template::findOrFail($id);
        ActionLog::create(['user_id' => $request->user()->id, 'action' => 'template_deleted', 'target_type' => 'template', 'target_id' => $template->id, 'details' => $template->title]);
        $template->delete();
        return response()->json(['success' => true]);
    }
}
