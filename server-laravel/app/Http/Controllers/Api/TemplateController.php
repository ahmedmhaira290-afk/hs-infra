<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        return response()->json($template, 201);
    }

    public function update(Request $request, $id)
    {
        $template = Template::findOrFail($id);
        $template->update($request->all());
        return response()->json($template);
    }

    public function destroy($id)
    {
        Template::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
