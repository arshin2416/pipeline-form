# 📘 ApperFileUploader - Introduction, Usage & Configuration

## Overview / Introduction

**ApperFileUploader** is a powerful file upload component from the ApperSDK that simplifies the process of uploading, managing, and displaying files in your web applications. It provides a complete solution for handling file attachments with minimal configuration, whether you're building a React app, Vue app, or any other web framework.

### What Problem Does It Solve?

File uploads are notoriously complex to implement correctly. You need to handle:
- File selection and validation
- Secure file uploads to cloud storage
- Progress tracking and error handling
- Displaying uploaded files with preview and download options
- Managing file metadata and associations
- Integrating with backend APIs

ApperFileUploader abstracts away all this complexity, providing a production-ready file upload solution that works out of the box.

---

## Key Features

✅ **Easy Integration** - Mount the uploader with just a few lines of code

✅ **Multiple Upload Modes** - Support for single or multiple file uploads

✅ **File Type Validation** - Restrict uploads by file extension (PDF, images, documents, etc.)

✅ **Size Limits** - Configure maximum file size per upload

✅ **Existing Files Display** - Show previously uploaded files with download/delete options

✅ **Progress Tracking** - Real-time upload progress feedback

✅ **Record Association** - Automatically associate files with database records

✅ **Secure Uploads** - Built-in integration with presigned URL generation

✅ **Callbacks & Events** - Hooks for success, error, and progress events

✅ **Flexible UI** - Configurable upload buttons, icons, and display options

✅ **Lifecycle Management** - Proper mount/unmount handling for React and other frameworks

---

## Installation & Setup

### Step 1: Install ApperSDK

The ApperSDK is loaded via a CDN script tag. Add this to your HTML file (typically in `index.html` or your app's entry point):

```html
<!DOCTYPE html>
<html>
<head>
  <title>Your App</title>
  <!-- Add ApperSDK script -->
  <script src="https://cdn.apper.io/sdk/v1/apper-sdk.js"></script>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```

**Note:** The SDK will be available globally as `window.ApperSDK` once loaded.

### Step 2: Environment Variables

Create a `.env` file in your project root with your Apper credentials:

```env
VITE_APPER_PROJECT_ID=your_project_id_here
VITE_APPER_PUBLIC_KEY=your_public_key_here
```

**How to Get These Credentials:**
1. Sign up or log in to your Apper account at [https://app.apper.io](https://app.apper.io)
2. Navigate to your project settings
3. Copy your Project ID and Public Key
4. Paste them into your `.env` file

**Security Note:** The public key is safe to expose in client-side code. Never include your private/secret key in frontend code.

### Step 3: Verify SDK Loading

Before using ApperFileUploader, ensure the SDK is loaded:

```javascript
// Wait for ApperSDK to be available
const waitForSDK = async () => {
  while (!window.ApperSDK) {
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  return window.ApperSDK;
};

// Usage
const SDK = await waitForSDK();
console.log('ApperSDK loaded:', SDK);
```

---

## Required Configuration

### Backend Setup - Presigned URL API

ApperFileUploader uses **presigned URLs** for secure file uploads. This means:
1. Your client requests an upload URL from your backend
2. Your backend generates a secure, time-limited upload URL
3. The client uploads the file directly to cloud storage using this URL

**Why This Approach?**
- **Security:** Files are uploaded directly to storage without passing through your server
- **Performance:** Reduces server load and improves upload speeds
- **Scalability:** Can handle large files efficiently

The ApperSDK handles the presigned URL flow automatically when you configure the `ApperClient` with your credentials.

### SDK Initialization

You need to initialize the **ApperClient** before using the file uploader:

```javascript
import { useEffect, useRef } from 'react';

const MyComponent = () => {
  const apperClientRef = useRef(null);

  useEffect(() => {
    const initializeSDK = async () => {
      // Wait for SDK to load
      while (!window.ApperSDK) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Create ApperClient instance
      const { ApperClient } = window.ApperSDK;
      apperClientRef.current = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    };

    initializeSDK();
  }, []);

  // Now you can use apperClientRef.current in your upload config
};
```

---

## Dependencies & Required Packages

### For React Projects

If you're using React, you'll need:

```json
{
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0"
  }
}
```

**No additional npm packages are required** for the file uploader itself - the ApperSDK is loaded via CDN.

### For Vue/Other Frameworks

The ApperSDK works with any JavaScript framework. Just ensure:
- The SDK script is loaded before your app code
- You wait for `window.ApperSDK` to be available before using it

---

## Basic Understanding - How It Works

### The Upload Flow

Here's what happens when a user uploads a file:

1. **User selects file(s)** → Browser file picker opens
2. **Client validates file** → Checks file size, type, and count limits
3. **Request presigned URL** → ApperClient requests secure upload URL from Apper backend
4. **Upload to storage** → File is uploaded directly to cloud storage (AWS S3, etc.)
5. **Save metadata** → File information (name, size, URL) is saved to your database
6. **Callback triggered** → Your `onSuccess` callback receives the uploaded file data

### Two Main Usage Patterns

#### Pattern 1: FileField (Integrated with Apper Records)

Used when you want to associate uploaded files with a specific database record:

- Files are automatically linked to a table record
- Perfect for forms, detail pages, and data management UIs
- Uses `ApperFileUploader.FileField.mount()`

#### Pattern 2: Standalone Uploader

Used when you want a generic file uploader without automatic record association:

- You manually handle the uploaded file data
- Useful for custom workflows, multi-step forms, or temporary uploads
- Uses `ApperFileUploader.showFileUploader()`

### Component Lifecycle

The ApperFileUploader has a defined lifecycle:

1. **Mount** → Initialize the uploader in a DOM element
2. **Active** → User can upload, view, and delete files
3. **Update** → Files can be added/removed dynamically
4. **Unmount** → Clean up when component is destroyed

**Important:** Always unmount the file uploader when your component unmounts to prevent memory leaks.

---

## Configuration Overview

### Essential Configuration Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `fieldId` | String | Yes | Unique identifier for this file field |
| `apperProjectId` | String | Yes | Your Apper project ID |
| `apperPublicKey` | String | Yes | Your Apper public key |
| `tableNameOrId` | String | For FileField | Database table name |
| `fieldNameOrId` | String | For FileField | Database field name |
| `existingFiles` | Array | No | Previously uploaded files to display |
| `uploadConfig` | Object | Yes | Upload configuration with ApperClient |

### Upload Configuration Object

```javascript
uploadConfig: {
  apperClient: apperClientRef.current,  // Required: ApperClient instance
  purpose: 'RecordAttachment',           // Purpose of the upload
  canvasUniqueId: 'your_project_id',     // Optional: Canvas identifier
  isExternal: false                      // Optional: External file links
}
```

### File Restrictions

```javascript
{
  fileCount: 3,                          // Maximum number of files
  maxFiles: 5,                           // Alternative to fileCount
  maxFileSize: 10 * 1024 * 1024,        // Max size in bytes (10MB)
  supportedExtensions: ['pdf', 'jpg'],   // Allowed file types
  allowMultiple: true                    // Allow multiple file selection
}
```

### UI Customization

```javascript
{
  title: 'Upload File',                  // Upload dialog title
  description: 'Select files to upload', // Instructions text
  showRestrictions: true,                // Show file restrictions info
  showUploadedFilesInPopOver: true,      // Display files in popover
  uploadButtonConfig: {
    hidden: false,                       // Show/hide upload button
    disabled: false,                     // Enable/disable button
    iconOnly: true                       // Show only icon (no text)
  }
}
```

---

## Next Steps

Now that you understand what ApperFileUploader is and how it's configured, you're ready to implement it in your project.

👉 **Continue to [Document 2: Usage Examples & Best Practices](./ApperFileUploader-Usage-Examples.md)** to see real-world code examples and integration patterns.

---

## Quick Reference

### Import the SDK Component

```javascript
// Global SDK access
const { ApperFileUploader, ApperClient } = window.ApperSDK;
```

### Initialize ApperClient

```javascript
const apperClient = new ApperClient({
  apperProjectId: 'your_project_id',
  apperPublicKey: 'your_public_key'
});
```

### Mount a File Field

```javascript
await ApperFileUploader.FileField.mount('element-id', config);
```

### Unmount When Done

```javascript
ApperFileUploader.FileField.unmount('element-id');
```

---

**Need Help?**
- Check the [Usage Examples documentation](./ApperFileUploader-Usage-Examples.md)
- Review the code examples in your project
- Contact Apper support for technical assistance

