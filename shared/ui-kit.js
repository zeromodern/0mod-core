/**
 * 0mod UI Kit
 * Simple vanilla JS/HTML string builders.
 * Assumes Tailwind CSS is available in the environment.
 */

const Button = ({ text, onClick, variant = 'primary', type = 'button', className = '' }) => {
  const baseClasses = "px-4 py-2 rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary: "bg-slate-900 text-white hover:bg-slate-800 focus:ring-slate-500 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus:ring-slate-500 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700",
    success: "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 focus:ring-slate-500 dark:text-slate-400 dark:hover:bg-slate-800"
  };
  
  // If onClick is a string, it's treated as the attribute value (e.g., "handleClick()").
  // If it's not provided, the caller handles the event listener attachment via ID or class.
  const clickAttr = onClick ? `onclick="${onClick}"` : '';
  
  return `
    <button 
      type="${type}" 
      class="${baseClasses} ${variants[variant] || variants.primary} ${className}"
      ${clickAttr}
    >
      ${text}
    </button>
  `;
};

const Input = ({ id, label, type = 'text', placeholder = '', value = '', className = '' }) => {
  return `
    <div class="mb-4 ${className}">
      ${label ? `<label for="${id}" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">${label}</label>` : ''}
      <input
        type="${type}"
        id="${id}"
        class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-soft focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
        placeholder="${placeholder}"
        value="${value}"
      >
    </div>
  `;
};

const TextArea = ({ id, label, placeholder = '', value = '', rows = 5, className = '' }) => {
  return `
    <div class="mb-4 ${className}">
      ${label ? `<label for="${id}" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">${label}</label>` : ''}
      <textarea
        id="${id}"
        rows="${rows}"
        class="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-soft focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
        placeholder="${placeholder}"
      >${value}</textarea>
    </div>
  `;
};

const Card = ({ title, content, className = '' }) => {
  return `
    <div class="bg-white dark:bg-slate-800 shadow-soft border border-slate-200 dark:border-slate-700 rounded-xl p-6 ${className}">
      ${title ? `<h3 class="text-lg font-bold text-slate-900 dark:text-white mb-4">${title}</h3>` : ''}
      <div class="dark:text-slate-300">${content}</div>
    </div>
  `;
};

const Alert = ({ title, message, type = 'info' }) => {
  const types = {
    info: "bg-blue-50 text-blue-700 border-blue-200",
    success: "bg-emerald-50 text-emerald-600 border-emerald-200",
    warning: "bg-amber-50 text-amber-700 border-amber-200",
    error: "bg-red-50 text-red-700 border-red-200"
  };
  
  return `
    <div class="rounded-md p-4 border ${types[type] || types.info} mb-4">
      <div class="flex">
        <div class="ml-3">
          ${title ? `<h3 class="text-sm font-medium">${title}</h3>` : ''}
          <div class="text-sm mt-1">
            <p>${message}</p>
          </div>
        </div>
      </div>
    </div>
  `;
};

const FileUpload = ({ id, label, accept = '*', multiple = false, className = '', fileTypeLabel = 'Image files only' }) => {
  return `
    <div class="mb-4 ${className}">
      ${label ? `<label class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">${label}</label>` : ''}
      <div
        id="${id}-dropzone"
        onclick="document.getElementById('${id}').click()"
        class="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-slate-50 dark:bg-slate-900/50"
      >
        <input type="file" id="${id}" class="hidden" accept="${accept}" ${multiple ? 'multiple' : ''}>
        <div class="flex flex-col items-center">
          <div class="p-3 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <p class="text-sm text-slate-600 dark:text-slate-400">
            <span class="font-semibold text-emerald-600">Click to upload</span> or drag and drop
          </p>
          <p class="text-xs text-slate-400 mt-1">${fileTypeLabel}</p>
        </div>
      </div>
    </div>
  `;
};

const Select = ({ id, label, options = [], value = '', onChange, className = '' }) => {
  const optionsHtml = options.map(opt =>
    `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`
  ).join('');

  const changeAttr = onChange ? `onchange="${onChange}"` : '';

  return `
    <div class="mb-4 ${className}">
      ${label ? `<label for="${id}" class="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">${label}</label>` : ''}
      <div class="relative">
        <select
          id="${id}"
          class="appearance-none w-full px-3 py-2 border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white rounded-md shadow-soft focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 pr-8"
          ${changeAttr}
        >
          ${optionsHtml}
        </select>
        <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
          <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
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
  className = ''
}) => {
  return `
    <div class="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-900/50 rounded-xl p-6 ${className}">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-emerald-900 dark:text-emerald-100 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Ready to Download
        </h3>
        ${onReset ? `
          <button onclick="${onReset}" class="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 font-medium">
            Convert another
          </button>
        ` : ''}
      </div>

      <div class="flex flex-col md:flex-row items-end gap-4">
        <div class="flex-grow w-full">
          <label for="${id}-filename" class="block text-sm font-medium text-emerald-900 dark:text-emerald-100 mb-1">File Name</label>
          <div class="flex shadow-sm">
            <input
              type="text"
              id="${id}-filename"
              value="${filename}"
              oninput="${onFilenameChange}"
              class="flex-grow px-3 py-2 border border-emerald-200 dark:border-emerald-800 dark:bg-slate-900 dark:text-white rounded-l-md focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="Enter filename"
            />
            <span class="inline-flex items-center px-3 rounded-r-md border border-l-0 border-emerald-200 dark:border-emerald-800 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-medium select-none">
              ${extension}
            </span>
          </div>
        </div>

        <div class="w-full md:w-auto flex-shrink-0">
          ${Button({
            text: `Download ${size ? `<span class="opacity-75 text-xs ml-1">(${size})</span>` : ''}`,
            onClick: onDownload,
            variant: 'success',
            className: 'w-full md:w-auto h-[42px] flex items-center justify-center'
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
  
  const modalHtml = `
    <div id="settings-modal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div class="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <h2 class="text-xl font-bold text-slate-900 dark:text-white">Settings</h2>
          <button onclick="document.getElementById('settings-modal').remove()" class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        
        <div class="p-6 space-y-6">
          <!-- Offline Status -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-slate-900 dark:text-white">Status</div>
              <div class="text-sm text-slate-500">Connection and service worker status</div>
            </div>
            <div class="flex items-center gap-2">
              <span class="flex h-2 w-2 rounded-full ${isOffline ? 'bg-red-500' : 'bg-emerald-500'}"></span>
              <span class="text-sm font-medium ${isOffline ? 'text-red-600' : 'text-emerald-600'}">${isOffline ? 'Offline' : 'Online'}</span>
            </div>
          </div>

          <!-- Version -->
          <div class="flex items-center justify-between">
            <div>
              <div class="font-medium text-slate-900 dark:text-white">Version</div>
              <div class="text-sm text-slate-500">Current platform version</div>
            </div>
            <div class="text-sm font-mono text-slate-400">v0.1.0-alpha</div>
          </div>

          <!-- Clear Data -->
          <div class="pt-4 border-t border-slate-100 dark:border-slate-800">
            <button id="clear-data-btn" class="w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors border border-red-200 dark:border-red-900/50">
              Clear Local Data
            </button>
            <p class="mt-2 text-xs text-slate-400 text-center">This will clear all locally stored settings and tool data.</p>
          </div>
        </div>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Event Listeners
  const toggle = document.getElementById('theme-toggle');
  console.log('[Debug] theme-toggle element:', toggle);
  if (!toggle) {
    console.error('[Debug] theme-toggle element not found! This will cause a TypeError on the next line.');
  }
  toggle.addEventListener('change', (e) => {
    const theme = e.target.checked ? 'dark' : 'light';
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    
    // Also update Tailwind class if present
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  const clearBtn = document.getElementById('clear-data-btn');
  clearBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all local data? This cannot be undone.')) {
      localStorage.clear();
      window.location.reload();
    }
  });
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
