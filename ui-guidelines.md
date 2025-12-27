# UI/UX Guidelines

Consistent design and user experience are critical for the 0mod platform. These guidelines ensure all tools feel like part of a cohesive suite.

## Core UX Rules

### 1. Drag & Drop First
*   For file-based tools, the primary interface must be a large, friendly drop zone.
*   Support both drag-and-drop and click-to-upload.

### 2. Simple vs. Advanced
*   **Default View:** Show only the essential controls needed for the primary task.
*   **Advanced Mode:** Hide complex settings behind a toggle or "Advanced Options" accordion.

### 3. Trust Signals
*   Always display the "🛡️ Offline Secure" badge (handled by the wrapper, but reinforce in copy if needed).
*   Provide immediate feedback for actions (success messages, loading states).

### 4. Local Persistence
*   Auto-save user inputs (text fields, toggle states) to `localStorage` where appropriate.
*   Users should not lose their configuration on refresh.

## Design System

We use **Tailwind CSS** with a specific configuration.

### Typography
*   **Font:** `Inter` (sans-serif).
*   **Headings:** Slate-900, Font-Medium or Bold.
*   **Body:** Slate-600.

### Color Palette

| Role | Tailwind Class | Hex | Usage |
| :--- | :--- | :--- | :--- |
| **Background** | `bg-slate-50` | `#f8fafc` | Page background |
| **Surface** | `bg-white` | `#ffffff` | Cards, Modals |
| **Primary Text** | `text-slate-900` | `#0f172a` | Headings, Main Actions |
| **Secondary Text** | `text-slate-600` | `#475569` | Body text, descriptions |
| **Accent/Success** | `text-emerald-500` | `#10b981` | Success states, "Go" buttons |
| **Border** | `border-gray-200` | `#e5e7eb` | Dividers, Inputs |

## Shared UI Kit (`apps/shared/ui-kit.js`)

Use the shared UI kit to build your interface. This ensures consistency and allows the build system to inline styles efficiently.

### Usage

The UI kit is available globally via `window.zm.ui`.

### Components

#### Button
```javascript
zm.ui.Button({
  text: "Convert File",
  onClick: "handleConvert()", // String for global function
  variant: "primary" // 'primary', 'secondary', 'danger', 'ghost'
})
```

#### Input
```javascript
zm.ui.Input({
  id: "filename",
  label: "Output Filename",
  placeholder: "example.csv"
})
```

#### Card
Used for grouping related content.
```javascript
zm.ui.Card({
  title: "Settings",
  content: `<div>...html content...</div>`
})
```

#### Alert
Used for feedback messages.
```javascript
zm.ui.Alert({
  title: "Success",
  message: "File converted successfully.",
  type: "success" // 'info', 'success', 'warning', 'error'
})
```

## Implementation Note

When building your tool in `index.html`, you can render these components directly into your container:

```javascript
document.getElementById('app').innerHTML = `
  ${zm.ui.Card({
    title: "Upload",
    content: zm.ui.Button({ text: "Select File", variant: "primary" })
  })}
`;
```
