<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ActionLog;
use App\Models\Document;
use App\Models\Employee;
use App\Models\Template;
use Illuminate\Http\Request;

class DocumentController extends Controller
{
    public function index()
    {
        return response()->json(Document::orderBy('created_at', 'desc')->get());
    }

    public function generate(Request $request)
    {
        try {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'template_id' => 'required|exists:templates,id',
        ]);

        $emp = Employee::findOrFail($request->employee_id);
        $tpl = Template::findOrFail($request->template_id);

        $now = now();
        $count = Document::count();
        $ref = sprintf('DOC-%s-%03d', $now->format('Ymd'), $count + 1);

        $civilite = $emp->genre && $emp->genre[0] === 'F' ? 'Madame' : 'Monsieur';
        $extraData = $request->except(['employee_id', 'template_id']);

        $ctx = array_merge($emp->toArray(), ['civilite' => $civilite], $extraData, [
            'date' => $now->locale('fr_FR')->translatedFormat('l j F Y'),
            'raison_sociale' => 'HS-INFRA',
            'reference' => $ref,
        ]);

        $content = $tpl->content;
        $content = preg_replace_callback('/\{\{(\w+)\}\}/', function ($m) use ($ctx) {
            return $ctx[$m[1]] ?? '{{' . $m[1] . '}}';
        }, $content ?? '');

        $isFullHtml = str_starts_with(trim($content), '<!DOCTYPE') || str_starts_with(trim($content), '<html');
        $htmlContent = $isFullHtml ? $content : $this->toHtml($ref, $content);
        $htmlContent = str_replace('/images/', $request->getSchemeAndHttpHost() . '/images/', $htmlContent);

        $doc = Document::create([
            'reference' => $ref,
            'employee_id' => $emp->id,
            'template_id' => $tpl->id,
            'content' => $content,
            'html_content' => $htmlContent,
            'employee_name' => $emp->first_name . ' ' . $emp->last_name,
            'document_type' => $tpl->title,
        ]);

        ActionLog::create([
            'user_id' => $request->user()->id,
            'action' => 'document_generated',
            'target_type' => 'document',
            'target_id' => $doc->id,
            'details' => "{$tpl->title} pour {$emp->first_name} {$emp->last_name} (Réf: {$ref})",
        ]);

        return response()->json($doc, 201);
        } catch (\Throwable $e) {
            return response()->json(['error' => $e->getMessage(), 'line' => $e->getLine(), 'file' => $e->getFile()], 500);
        }
    }

    public function destroy(Request $request, $id)
    {
        $doc = Document::findOrFail($id);
        ActionLog::create([
            'user_id' => $request->user()->id,
            'action' => 'document_deleted',
            'target_type' => 'document',
            'target_id' => $doc->id,
            'details' => "{$doc->document_type} - {$doc->employee_name} (Réf: {$doc->reference})",
        ]);
        $doc->delete();
        return response()->json(['success' => true]);
    }

    private function toHtml($title, $content)
    {
        $lines = explode("\n", $content);
        $body = '';
        foreach ($lines as $line) {
            $t = trim($line);
            if ($t === '') {
                $body .= '<div style="height:0.4rem"></div>';
            } elseif (strtoupper($t) === $t && strlen($t) > 3) {
                $body .= '<h2 style="text-align:center;color:#0d2e4a;margin:1.2rem 0 0.8rem 0;font-size:1.3rem;font-weight:700">' . htmlspecialchars($t) . '</h2>';
            } else {
                $isLabel = str_contains($line, ':') && !str_starts_with($line, ' ');
                $style = $isLabel ? 'line-height:1.7;color:#000;font-weight:600' : 'line-height:1.7;color:#111';
                $body .= '<div style="' . $style . '">' . htmlspecialchars($line) . '</div>';
            }
        }

        return '<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><style>
  @page { margin: 12mm 15mm }
  * { margin: 0; padding: 0; box-sizing: border-box }
  body { font-family: \'Calibri\', \'Segoe UI\', Arial, sans-serif; font-size: 12.5px; color: #111; line-height: 1.5 }
  .doc { max-width: 210mm; margin: 0 auto; padding: 20px 30px; background: #fff; min-height: 297mm; position: relative }
  .header { text-align:center; border-bottom:2px solid #0d2e4a; padding-bottom:10px; margin-bottom:15px }
  .header img { height: 45px }
  .header h1 { font-size:1.1rem; color:#0d2e4a; margin:3px 0 0 0; font-weight:700 }
  .ref { text-align:right; font-size:0.75rem; color:#666; margin-bottom:10px }
  .content { position:relative; z-index:1; min-height:350px }
  .sig { margin-top:40px; display:flex; justify-content:space-between; gap:40px }
  .sig .col { flex:1 }
  .sig .col .label { font-size:0.8rem; font-weight:600; color:#0d2e4a; margin-bottom:4px }
  .sig .col .line { border-bottom:1px solid #333; height:35px; margin-bottom:3px }
  .sig .col .name { font-size:0.75rem; color:#888 }
  .footer { position:absolute; bottom:15px; left:30px; right:30px; border-top:1px solid #ddd; padding-top:5px; font-size:0.65rem; color:#999; text-align:center }
</style></head>
<body>
<div class="doc">
  <div class="header">
    <img src="/images/hs-infra-logo.png" alt="HS-INFRA" onerror="this.style.display=\'none\'">
    <h1>HS-INFRA</h1>
  </div>
  <div class="ref">N° RÉF : ' . htmlspecialchars($title) . ' — Date : ' . now()->locale('fr_FR')->translatedFormat('l j F Y') . '</div>
  <div class="content">' . $body . '</div>
  <div class="sig">
    <div class="col">
      <div class="label">Signature de l\'employé(e)</div>
      <div class="line"></div>
      <div class="name">Nom & Prénom : _______________</div>
    </div>
    <div class="col">
      <div class="label">Signature du Responsable RH</div>
      <div class="line"></div>
      <div class="name">Cachet &amp; Signature</div>
    </div>
  </div>
  <div class="footer">HS-INFRA &mdash; Tanger, Maroc</div>
</div>
</body></html>';
    }
}
