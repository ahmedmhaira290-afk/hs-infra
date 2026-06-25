<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;

class EmployeeController extends Controller
{
    public function index()
    {
        return response()->json(Employee::orderBy('id')->get());
    }

    public function show($id)
    {
        return response()->json(Employee::findOrFail($id));
    }

    public function store(Request $request)
    {
        $employee = Employee::create($request->all());
        return response()->json($employee, 201);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        $employee->update($request->all());
        return response()->json($employee);
    }

    public function destroy($id)
    {
        Employee::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }
}
