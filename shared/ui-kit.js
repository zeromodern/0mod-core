/**
 * 0mod UI Kit
 * High-contrast, privacy-first vanilla component builders.
 * Assumes Tailwind CSS and base.css are available.
 */

const Button = ({ text, onClick, variant = 'primary', type = 'button', className = '', disabled = false }) => {
  const baseClasses = "inline-flex items-center justify-center px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.99] disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer";
  
  const variants = {
    primary: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-500/30 focus:ring-emerald-500 focus:ring-offset-white dark:focus:ring-offset-slate-900",
    secondary: "bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-900 dark:bg-slate-800 dark:hover:bg-slate-700 dark:active:bg-slate-650 dark:text-white border border-slate-300 dark:border-slate-700 shadow-xs focus:ring-slate-400 focus:ring-offset-white dark:focus:ring-offset-slate-900",
    success: "bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-500/30 focus:ring-emerald-500",
    danger: "bg-red-600 hover:bg-red-500 active:bg-red-700 text-white shadow-sm ring-1 ring-red-500/30 focus:ring-red-500",
    ghost: "bg-transparent hover:bg-slate-100 active:bg-slate-200 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:active:bg-slate-700 focus:ring-slate-400"
  };
  
  const clickAttr = onClick ? `onclick="${onClick}"` : '';
  const disabledAttr = disabled ? 'disabled' : '';
  
  return `
    <button 
      type="${type}" 
      class="${baseClasses} ${variants[variant] || variants.primary} ${className}"
      ${clickAttr}
      ${disabledAttr}
    >
      ${text}
    </button>
  `;
};

const Input = ({ id, label, type = 'text', placeholder = '', value = '', className = '' }) => {
  return `
    <div class="mb-4 ${className}">
      ${label ? `<label for="${id}" class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">${label}</label>` : ''}
      <input
        type="${type}"
        id="${id}"
        class="w-full px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-xs text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-slate-400"
        placeholder="${placeholder}"
        value="${value}"
      >
    </div>
  `;
};

const TextArea = ({ id, label, placeholder = '', value = '', rows = 5, className = '', onInput = '' }) => {
  return `
    <div class="mb-4 ${className}">
      ${label ? `<label for="${id}" class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">${label}</label>` : ''}
      <textarea
        id="${id}"
        rows="${rows}"
        ${onInput ? `oninput="${onInput}"` : ''}
        class="w-full p-3.5 bg-slate-50/90 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-xs font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors placeholder:text-slate-400"
        placeholder="${placeholder}"
      >${value}</textarea>
    </div>
  `;
};

const Card = ({ title, content, className = '' }) => {
  return `
    <div class="bg-slate-50/70 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-6 sm:p-7 ${className}">
      ${title ? `<h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>${title}</h3>` : ''}
      <div class="text-slate-700 dark:text-slate-200">${content}</div>
    </div>
  `;
};

const Alert = ({ title, message, type = 'info' }) => {
  const styles = {
    info: {
      box: "bg-blue-50 bg-blue-50/90 dark:bg-blue-950/40 text-blue-900 dark:text-blue-200 border-blue-200 dark:border-blue-800",
      icon: '<svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    },
    success: {
      box: "bg-emerald-50 bg-emerald-50/90 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 border-emerald-200 dark:border-emerald-800",
      icon: '<svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    },
    warning: {
      box: "bg-amber-50 bg-amber-50/90 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200 border-amber-200 dark:border-amber-800",
      icon: '<svg class="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>'
    },
    error: {
      box: "bg-red-50 bg-red-50/90 dark:bg-red-950/40 text-red-900 dark:text-red-200 border-red-200 dark:border-red-800",
      icon: '<svg class="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
    }
  };
  
  const current = styles[type] || styles.info;
  
  return `
    <div class="rounded-xl p-4 border ${current.box} mb-5 flex items-start gap-3 shadow-xs">
      <div class="flex-shrink-0 mt-0.5">${current.icon}</div>
      <div class="flex-1">
        ${title ? `<h4 class="text-sm font-bold mb-0.5">${title}</h4>` : ''}
        <div class="text-xs sm:text-sm leading-relaxed">${message}</div>
      </div>
    </div>
  `;
};

const FileUpload = ({ id, label, accept = '*', multiple = false, className = '', fileTypeLabel = 'Supported files only' }) => {
  return `
    <div class="mb-5 ${className}">
      ${label ? `<label class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">${label}</label>` : ''}
      <div
        id="${id}-dropzone"
        onclick="document.getElementById('${id}').click()"
        class="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-2xl p-8 sm:p-10 text-center transition-all duration-200 cursor-pointer bg-slate-50/80 dark:bg-slate-950/60 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 group shadow-xs"
      >
        <input type="file" id="${id}" class="hidden" accept="${accept}" ${multiple ? 'multiple' : ''}>
        <div class="flex flex-col items-center">
          <div class="p-3.5 bg-white dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xs mb-3 group-hover:scale-105 group-hover:border-emerald-500/50 group-hover:text-emerald-500 transition-all text-slate-500 dark:text-slate-400">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p class="text-sm text-slate-700 dark:text-slate-200">
            <span class="font-bold text-emerald-600 dark:text-emerald-400 group-hover:underline">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">${fileTypeLabel}</p>
        </div>
      </div>
    </div>
  `;
};

const Select = ({ id, label, options = [], value = '', onChange, className = '' }) => {
  const optionsHtml = options.map(opt =>
    `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''} ${opt.disabled ? 'disabled' : ''}>${opt.label}</option>`
  ).join('');

  const changeAttr = onChange ? `onchange="${onChange}"` : '';

  return `
    <div class="mb-4 ${className}">
      ${label ? `<label for="${id}" class="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">${label}</label>` : ''}
      <div class="relative">
        <select
          id="${id}"
          class="appearance-none w-full px-3.5 py-2.5 bg-slate-50/90 dark:bg-slate-950/70 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl shadow-xs text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 pr-10 transition-colors"
          ${changeAttr}
        >
          ${optionsHtml}
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500 dark:text-slate-400">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
    </div>
  `;
};

const DownloadSection = ({
  id,
  filename,
  extension,
  onFilenameChange,
  onDownload,
  size = null,
  onReset = null,
  disabled = false,
  className = ''
}) => {
  return `
    <div class="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-6 sm:p-7 shadow-xs ${className} ${disabled ? 'opacity-60 pointer-events-none' : ''}">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-bold text-emerald-950 dark:text-emerald-100 flex items-center gap-2">
          <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <span>${disabled ? 'Processing...' : 'Ready to Download'}</span>
        </h3>
        ${onReset && !disabled ? `
          <button onclick="${onReset}" class="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-300 dark:hover:text-emerald-200 underline cursor-pointer">
            Convert another
          </button>
        ` : ''}
      </div>

      <div class="flex flex-col sm:flex-row items-end gap-3">
        <div class="flex-grow w-full">
          <label for="${id}-filename" class="block text-xs font-bold uppercase tracking-wider text-emerald-900 dark:text-emerald-200 mb-1.5">Output File Name</label>
          <div class="flex rounded-xl shadow-xs overflow-hidden border border-emerald-300 dark:border-emerald-700/80 focus-within:ring-2 focus-within:ring-emerald-500 focus-within:border-emerald-500">
            <input
              type="text"
              id="${id}-filename"
              value="${filename}"
              oninput="${onFilenameChange}"
              ${disabled ? 'disabled' : ''}
              class="flex-grow px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none ${disabled ? 'bg-slate-100 dark:bg-slate-800' : ''}"
              placeholder="Enter filename"
            />
            <span class="inline-flex items-center px-3.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-200 text-xs font-mono font-bold select-none border-l border-emerald-200 dark:border-emerald-800">
              ${extension}
            </span>
          </div>
        </div>

        <div class="w-full sm:w-auto flex-shrink-0">
          ${Button({
            text: disabled ? 'Processing...' : `Download ${size ? `<span class="opacity-80 text-xs ml-1 font-mono">(${size})</span>` : ''}`,
            onClick: onDownload,
            variant: 'primary',
            className: 'w-full sm:w-auto h-[44px] flex items-center justify-center px-6',
            disabled: disabled
          })}
        </div>
      </div>
    </div>
  `;
};

/**
 * Settings Modal
 */
const openSettings = () => {
  const isOffline = !navigator.onLine;
  const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
  
  const modalHtml = `
    <div id="settings-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 class="text-lg font-bold text-slate-900 dark:text-white">Workspace Settings</h2>
          <button onclick="document.getElementById('settings-modal').remove()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Theme -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-sm text-slate-900 dark:text-white">Color Theme</div>
              <div class="text-xs text-slate-500">Toggle dark / light appearance</div>
            </div>
            <button id="modal-theme-toggle" class="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-emerald-500">
              ${currentTheme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
            </button>
          </div>

          <!-- Offline Status -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-sm text-slate-900 dark:text-white">Execution Mode</div>
              <div class="text-xs text-slate-500">Zero uploads verified</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="flex h-2.5 w-2.5 rounded-full ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}"></span>
              <span class="text-xs font-semibold ${isOffline ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}">${isOffline ? 'Offline (Safe)' : 'In-Browser (Online)'}</span>
            </div>
          </div>

          <!-- Version -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-semibold text-sm text-slate-900 dark:text-white">Engine Version</div>
              <div class="text-xs text-slate-500">0mod Client Studio</div>
            </div>
            <div class="text-xs font-mono font-bold text-slate-400">v1.1.0</div>
          </div>

          <!-- Clear Data -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button id="clear-data-btn" class="w-full px-4 py-2.5 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors border border-red-200 dark:border-red-900/60 cursor-pointer">
              Clear Cached Tool Data
            </button>
            <p class="mt-2 text-[11px] text-slate-400 text-center">Resets all locally saved inputs, options, and cache.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Wire Theme Toggle in Modal
  const modalToggle = document.getElementById('modal-theme-toggle');
  if (modalToggle) {
    modalToggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('dark');
      const nextTheme = isDark ? 'dark' : 'light';
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem('theme', nextTheme);
      modalToggle.textContent = isDark ? '🌙 Dark Mode' : '☀️ Light Mode';
    });
  }

  const clearBtn = document.getElementById('clear-data-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
        localStorage.clear();
        window.location.reload();
      }
    });
  }
};

// Expose to window
if (typeof window !== 'undefined') {
  window.zm = window.zm || {};
  window.zm.ui = {
    openSettings,
    Button,
    Input,
    TextArea,
    Card,
    Alert,
    FileUpload,
    Select,
    DownloadSection
  };
}
