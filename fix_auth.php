<?php
$file = __DIR__ . '/app/Http/Controllers/Auth/AuthController.php';
$content = file_get_contents($file);

// Replace the Inertia::location block with a simple redirect
$search = <<<'PHP'
        if ($request->inertia()) {
            return \Inertia\Inertia::location($dashboard);
        }

        return redirect()->intended($dashboard);
PHP;

$replace = '        return redirect()->to($dashboard);';

$newContent = str_replace($search, $replace, $content);

if ($newContent === $content) {
    // Try with \n line endings
    $search2 = "        if (\$request->inertia()) {\n            return \\Inertia\\Inertia::location(\$dashboard);\n        }\n\n        return redirect()->intended(\$dashboard);";
    $newContent = str_replace($search2, $replace, $content);
}

if ($newContent !== $content) {
    file_put_contents($file, $newContent);
    echo "SUCCESS: AuthController fixed.\n";
} else {
    echo "WARNING: Pattern not found. Showing lines 50-58:\n";
    $lines = explode("\n", $content);
    for ($i = 49; $i < min(58, count($lines)); $i++) {
        echo ($i+1) . ": " . $lines[$i] . "\n";
    }
}
