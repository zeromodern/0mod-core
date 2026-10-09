export const HTML_BOILERPLATE = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document Converter - 0mod</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    fontFamily: {
                        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
                    },
                    colors: {
                        brand: {
                            black: '#0f172a',
                            gray: '#f8fafc',
                            accent: '#10b981',
                        }
                    },
                    boxShadow: {
                        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
                    }
                }
            }
        }
    </script>
    <link rel="stylesheet" href="../shared/base.css">
    <meta name="description" content="Free offline tool to convert between Markdown, PDF, and HTML.">
</head>
<body class="bg-brand-gray dark:bg-slate-950 min-h-screen font-sans text-slate-800 dark:text-slate-100 antialiased transition-colors duration-200">
    <div id="app" class="max-w-5xl mx-auto px-4 py-12"></div>

    <!-- TOOL UI START -->
    <script src="../shared/ui-kit.js"></script>
    <script src="../shared/icons.js"></script>
    <script>
        const app = document.getElementById('app');

        // Default config
        const defaultConfig = {
            // Add app-specific defaults here
        };

        // Merge injected config with defaults
        const config = Object.assign({}, defaultConfig, window.APP_CONFIG || {});

        // State
        let state = {
            isProcessing: false,
            // Add more state variables here
        };

        // Logic
        function handleAction() {
            state.isProcessing = true;
            render();

            // Implement tool logic here
            setTimeout(() => {
                state.isProcessing = false;
                render();
            }, 1000);
        }

        function handleShare() {
            if (navigator.share) {
                navigator.share({
                    title: 'Document Converter - 0mod',
                    text: 'Free offline tool to convert between Markdown, PDF, and HTML.',
                    url: window.location.href
                });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('Link copied to clipboard!');
            }
        }

        function handleBookmark() {
            navigator.clipboard.writeText(window.location.href);
            alert('URL copied to clipboard! Press Ctrl+D (Cmd+D on Mac) to bookmark this page.');
        }

        // Render
        function render() {
            const { Button, Card, Input, TextArea } = window.zm.ui;

            app.innerHTML = \`
                <div class="space-y-8">
                    <header class="text-center">
                        <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-2">Document Converter</h1>
                        <p class="text-slate-600 dark:text-slate-400">Free offline tool to convert between Markdown, PDF, and HTML.</p>
                    </header>

                    \${Card({
                        title: 'Tool Interface',
                        content: \`
                            <div class="space-y-4">
                                \${TextArea({
                                    id: 'main-input',
                                    label: 'Input Content',
                                    placeholder: 'Paste or type content here...',
                                    value: state.inputText || '',
                                    onInput: 'window.handleInputChange(event)',
                                    rows: 8
                                })}
                                <div class="flex justify-end">
                                    \${Button({
                                        text: state.isProcessing ? 'Processing...' : 'Run Action',
                                        onClick: 'window.handleAction()',
                                        variant: 'primary',
                                        disabled: state.isProcessing
                                    })}
                                </div>
                            </div>
                        \`
                    })}

                    <div class="text-center text-sm text-slate-500 dark:text-slate-400">
                        <p>100% Client-side processing. Your data never leaves your browser.</p>
                    </div>

                    <footer class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div class="flex items-center gap-4">
                            <span class="text-xs font-medium text-slate-400">v1.0.0</span>
                            <button onclick="window.handleShare()" class="text-xs font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
                                Share Tool
                            </button>
                            <button onclick="window.handleBookmark()" class="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1">
                                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                                Bookmark Tool
                            </button>
                        </div>
                        <div class="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                            🛡️ Zero Uploads • 100% Private
                        </div>
                    </footer>
                </div>
            \`;
        }

        // Global handlers
        window.handleInputChange = (e) => { state.inputText = e.target.value; };
        window.handleAction = handleAction;
        window.handleShare = handleShare;
        window.handleBookmark = handleBookmark;

        // Initialize theme
        const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
        document.documentElement.dataset.theme = savedTheme;

        // Initial render
        render();
    </script>
    <!-- TOOL UI END -->
</body>
</html>\`;

export const META_STRUCTURE = {
  id: "doc-converter",
  title: "Document Converter",
  description: "Free offline tool to convert between Markdown, PDF, and HTML.",
  keywords: ["doc","converter","pdf","markdown","html"],
  version: "1.0.0",
  author: "0mod",
  created: "2026-04-08",
  theme_color: "#10b981",
  background_color: "#f8fafc",
  display: "standalone"
};

export const RULES = [
  "Zero Server: All logic runs client-side. No user files are ever uploaded to a server.",
  "Single File: The logic lives in index.html.",
  "No Build Step: The file must open in a browser (file:// or localhost) and work immediately.",
  "Universal UI: Every tool includes shared/ui-kit.js and shared/icons.js via script tags.",
  "Local Persistence: All inputs auto-save to localStorage or indexedDB.",
  "UX Guidelines: Use massive, friendly drop zones for file tools. Hide complex settings behind a toggle.",
  "Markers: Use <!-- TOOL UI START --> and <!-- TOOL UI END --> markers around the main logic/UI for the build script.",
  "UI Library: Always use window.zm.ui components for consistent interface."
];
