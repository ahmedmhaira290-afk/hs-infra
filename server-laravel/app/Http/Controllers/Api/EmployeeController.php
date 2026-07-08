<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
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
        ActionLog::create(['user_id' => $request->user()->id, 'action' => 'employee_created', 'target_type' => 'employee', 'target_id' => $employee->id, 'details' => "{$employee->first_name} {$employee->last_name}"]);
        return response()->json($employee, 201);
    }

    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        $old = "{$employee->first_name} {$employee->last_name}";
        $employee->update($request->all());
        ActionLog::create(['user_id' => $request->user()->id, 'action' => 'employee_updated', 'target_type' => 'employee', 'target_id' => $employee->id, 'details' => $old]);
        return response()->json($employee);
    }

    public function destroy(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);
        ActionLog::create(['user_id' => $request->user()->id, 'action' => 'employee_deleted', 'target_type' => 'employee', 'target_id' => $employee->id, 'details' => "{$employee->first_name} {$employee->last_name}"]);
        $employee->delete();
        return response()->json(['success' => true]);
    }
}
