# 📘 ApperFileUploader - Complete Guide

A comprehensive beginner-friendly guide for using the ApperFileUploader component from ApperSDK.


---

## Table of Contents


 1. [Overview & Introduction](#overview--introduction)
 2. [Key Features](#key-features)
 3. [Installation & Setup](#installation--setup)
 4. [Required Configuration](#required-configuration)
 5. [Basic Understanding](#basic-understanding)
 6. [Configuration Reference](#configuration-reference)
 7. [Basic Usage Example](#basic-usage-example)
 8. [Handling File Uploads](#handling-file-uploads) (includes ApperFileFieldComponent)
 9. [Integration Scenarios](#integration-scenarios)
10. [Best Practices](#best-practices)
11. [Troubleshooting & Common Issues](#troubleshooting--common-issues)


---

## Overview & Introduction

**ApperFileUploader** is a powerful file upload component from the ApperSDK that simplifies the process of uploading, managing, and displaying files in your web applications. It provides a complete solution for handling file attachments with minimal configuration, whether you're building a React app, Vue app, or any other web framework.

### What Problem Does It Solve?

File uploads are notoriously complex to implement correctly. You need to handle:

* File selection and validation
* Secure file uploads to cloud storage
* Progress tracking and error handling
* Displaying uploaded files with preview and download options
* Managing file metadata and associations
* Integrating with backend APIs

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
  <script src="https://cdn.apper.io/sdk/v1/apper-sdk.js"></script> // For production
  <script src="https://test-cdn.apper.io/v1/apper-sdk.v1.js"></script> //For test server
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


1. Sign up or log in to your Apper account at <https://app.apper.io>
2. Navigate to your project settings
3. Copy your Project ID and Public Key
4. Paste them into your `.env` file


---

## Required Configuration

### Backend Setup - Presigned URL API

ApperFileUploader uses **presigned URLs** for secure file uploads. This means:


1. Your client requests an upload URL from your backend
2. Your backend generates a secure, time-limited upload URL
3. The client uploads the file directly to cloud storage using this URL

**Why This Approach?**

* **Security:** Files are uploaded directly to storage without passing through your server
* **Performance:** Reduces server load and improves upload speeds
* **Scalability:** Can handle large files efficiently

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

### Dependencies & Required Packages

#### For React Projects

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

#### For Vue/Other Frameworks

The ApperSDK works with any JavaScript framework. Just ensure:

* The SDK script is loaded before your app code
* You wait for `window.ApperSDK` to be available before using it


---

## Basic Understanding

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

* Files are automatically linked to a table record
* Perfect for forms, detail pages, and data management UIs
* Uses `ApperFileUploader.FileField.mount()`

#### Pattern 2: Standalone Uploader (Future Scope)

Used when you want a generic file uploader without automatic record association:

* You manually handle the uploaded file data
* Useful for custom workflows, multi-step forms, or temporary uploads
* Uses `ApperFileUploader.showFileUploader()`

### Component Lifecycle

The ApperFileUploader has a defined lifecycle:


1. **Mount** → Initialize the uploader in a DOM element
2. **Active** → User can upload, view, and delete files
3. **Update** → Files can be added/removed dynamically
4. **Unmount** → Clean up when component is destroyed

**Important:** Always unmount the file uploader when your component unmounts to prevent memory leaks.


---

## Configuration Reference

### Essential Configuration Properties

| Property | Type | Required | Description |
|----|----|----|----|
| `fieldKey` | String | Yes | Unique identifier for this file field |
| `apperProjectId` | String | Yes | Your Apper project ID |
| `apperPublicKey` | String | Yes | Your Apper public key |
| `tableName` | String | For FileField | Database table name |
| `fieldName` | String | For FileField | Database field name |
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
  showUploadedFilesInPopOver: true,      // Display files in popover
  uploadButtonConfig: {
    hidden: false,                       // Show/hide upload button
    disabled: false,                     // Enable/disable button
    iconOnly: true                       // Show only icon (no text)
  }
}
```


---

## Basic Usage Example (Future Scope)

### Simple Standalone File Uploader

This example shows the most straightforward way to add a file uploader to your app:

```javascript
import React, { useEffect, useState, useRef } from 'react';

const SimpleFileUploader = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const apperClientRef = useRef(null);

  // Step 1: Initialize ApperSDK
  useEffect(() => {
    const initializeSDK = async () => {
      try {
        // Wait for ApperSDK to be available
        while (!window.ApperSDK) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        const { ApperClient } = window.ApperSDK;

        // Create ApperClient instance
        apperClientRef.current = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize:', err);
      }
    };

    initializeSDK();
  }, []);

  // Step 2: Show the file uploader
  useEffect(() => {
    if (!isReady || !window.ApperSDK) return;

    const showUploader = async () => {
      const { ApperFileUploader } = window.ApperSDK;

      const config = {
        // Files already uploaded
        existingFiles: uploadedFiles,
        
        // Callback when files change
        onUploadedFilesChanged: (files) => {
          console.log('Files changed:', files);
          setUploadedFiles(files);
        },
        
        // Upload configuration
        uploadConfig: {
          apperClient: apperClientRef.current,
          purpose: 'RecordAttachment'
        },
        
        // UI configuration
        title: 'Upload Your Files',
        description: 'Select files to upload (PDF, JPG, PNG)',
        allowMultiple: true,
        maxFiles: 5,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        supportedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
        
        // Event callbacks
        onSuccess: (results) => {
          console.log('Upload successful:', results);
        },
        onError: (error) => {
          console.error('Upload failed:', error);
          alert('Upload failed: ' + error.message);
        },
        onProgress: (progress) => {
          console.log('Upload progress:', progress + '%');
        }
      };

      await ApperFileUploader.showFileUploader('my-uploader', config);
    };

    showUploader();
  }, [isReady, uploadedFiles]);

  return (
    <div>
      <h2>File Upload Demo</h2>
      <div id="my-uploader" style={{ minHeight: '200px' }} />
      
      {uploadedFiles.length > 0 && (
        <div>
          <h3>Uploaded Files ({uploadedFiles.length})</h3>
          <ul>
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file.name} - {file.size} bytes</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SimpleFileUploader;
```

### Key Props Explained

| Prop | Type | Description | Example |
|----|----|----|----|
| `existingFiles` | Array | Previously uploaded files to display | `[{id: '1', name: 'file.pdf', url: '...'}]` |
| `onUploadedFilesChanged` | Function | Called when files are added/removed | `(files) => setFiles(files)` |
| `uploadConfig` | Object | Contains ApperClient and upload settings | See example above |
| `title` | String | Upload dialog title | `'Upload Documents'` |
| `maxFiles` | Number | Maximum number of files allowed | `5` |
| `maxFileSize` | Number | Maximum file size in bytes | `10 * 1024 * 1024` (10MB) |
| `supportedExtensions` | Array | Allowed file extensions | `['pdf', 'jpg', 'png']` |
| `onSuccess` | Function | Called on successful upload | `(results) => console.log(results)` |
| `onError` | Function | Called on upload failure | `(error) => alert(error)` |
| `onProgress` | Function | Called with upload progress | `(progress) => console.log(progress)` |


---

## Handling File Uploads

### Understanding the Upload Flow

The ApperFileUploader handles three main scenarios:


1. **Create** - Upload files for a new record
2. **Update** - Manage files for an existing record
3. **Remove** - Delete uploaded files

### Using the ApperFileFieldComponent Wrapper

For easier integration and better developer experience, this project uses a custom React wrapper component called `ApperFileFieldComponent` that simplifies the ApperFileUploader usage by handling all the complexity internally.

#### What is ApperFileFieldComponent?

`ApperFileFieldComponent` is a production-ready React component that wraps the ApperFileUploader SDK, providing:

* **Automatic SDK initialization and mounting** - No manual setup required
* **Built-in error handling** - Shows user-friendly error messages
* **Loading states** - Displays loading spinner while initializing
* **Automatic cleanup** - Properly unmounts when component is destroyed
* **Smart updates** - Only re-renders when files actually change (prevents unnecessary remounts)
* **Format conversion** - Automatically converts between API and UI file formats

#### Full Component Implementation

Here's the complete code for the `ApperFileFieldComponent` wrapper:

```javascript
import React, { useEffect, useState, useRef, useMemo } from 'react';

const ApperFileFieldComponent = ({ 
  elementId, 
  config = {},
  className = '',
  style = {}
}) => {
  
  // State management
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  // Refs for tracking component lifecycle and state
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef(null);

  // Memoize existingFiles to detect actual changes
  // This prevents unnecessary re-renders when the files array reference changes
  // but the actual content remains the same
  const existingFiles = useMemo(() => {
    return config.existingFiles || [];
  }, [
    config.existingFiles?.length,
    config.existingFiles?.[0]?.Id || config.existingFiles?.[0]?.id
  ]);

  // Update elementId ref when it changes
  useEffect(() => {
    elementIdRef.current = elementId;
  }, [elementId]);

  // Main mounting effect - runs once when component mounts
  useEffect(() => {
    let mounted = true;

    const mountFileField = async () => {
      try {
        // Wait for ApperSDK to be available (loaded from CDN)
        let attempts = 0;
        const maxAttempts = 50; // 5 seconds max wait time

        while (!window.ApperSDK && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 100));
          attempts++;
        }
        
        if (!window.ApperSDK) {
          throw new Error('ApperSDK not loaded. Please ensure the SDK script is included before this component.');
        }

        // Check if component is still mounted before proceeding
        if (!mounted) return;

        const { ApperFileUploader } = window.ApperSDK;

        // Create unique element ID
        elementIdRef.current = `file-uploader-${elementId}`;
       
        // Mount the file field with the full config including existingFiles
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          existingFiles: existingFiles
        });

        if (mounted) {
          mountedRef.current = true;
          setIsReady(true);
          setError(null);
        }

      } catch (err) {
        console.error('Failed to mount ApperFileField:', err);
        if (mounted) {
          setError(err.message);
          setIsReady(false);
        }
      }
    };

    mountFileField();

    // Cleanup function - runs when component unmounts
    return () => {
      mounted = false;
      
      if (mountedRef.current && window.ApperSDK) {
        try {
          window.ApperSDK.ApperFileUploader.FileField.unmount(elementIdRef.current);
          mountedRef.current = false;
        } catch (err) {
          console.error('Failed to unmount ApperFileField:', err);
        }
      }
    };
  }, [elementId, config.existingFiles]);

  // Update files effect - runs when existingFiles change (without remounting)
  useEffect(() => {
    if (!isReady || !window.ApperSDK || !config.fieldKey) return;
    
    // Check if existingFiles have actually changed
    const filesChanged = JSON.stringify(existingFilesRef.current) !== JSON.stringify(existingFiles);
    if (!filesChanged) return;

    // Update ref to track current files
    existingFilesRef.current = existingFiles;

    // Update files if existingFiles provided
    if (existingFiles && Array.isArray(existingFiles) && existingFiles.length > 0) {
      try {
        const { ApperFileUploader } = window.ApperSDK;
        
        // Check if files need conversion from API format to UI format
        // API format: { Id, Name, Size, Type, Url }
        // UI format:  { id, name, size, type, url }
        const filesToUpdate = existingFiles[0]?.Id !== undefined
          ? ApperFileUploader.toUIFormat(existingFiles)
          : existingFiles;
        
        ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
      } catch (err) {
        console.error('Failed to update initial files:', err);
      }
    } else if (existingFiles.length === 0) {
      // Clear files if existingFiles is empty
      try {
        const { ApperFileUploader } = window.ApperSDK;
        ApperFileUploader.FileField.clearField(config.fieldKey);
      } catch (err) {
        console.error('Failed to clear files:', err);
      }
    }
  }, [existingFiles, isReady, config.fieldKey]);
  
  // Error UI
  if (error) {
    return (
      <div 
        className={`apper-file-field-error ${className}`}
        style={{
          padding: '1rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '0.375rem',
          color: '#dc2626',
          ...style
        }}
      >
        <strong>Error loading file field:</strong> {error}
      </div>
    );
  }

  // Main render
  return (
    <div 
      id={`file-uploader-${elementId}`}
      className={className}
      style={{
        minHeight: '200px',
        ...style
      }}
    >
      {!isReady && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '200px',
          color: '#64748b'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '2rem',
              height: '2rem',
              border: '2px solid #cbd5e1',
              borderTopColor: '#3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 0.5rem'
            }} />
            <div>Loading file uploader...</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApperFileFieldComponent;
```

#### Code Explanation: How It Works

Let's break down each part of the component:

**1. Props and Component Setup**

```javascript
const ApperFileFieldComponent = ({ 
  elementId,      // Unique ID for this uploader instance
  config = {},    // ApperFileUploader configuration
  className = '', // Optional CSS class
  style = {}      // Optional inline styles
}) => {
```

The component accepts four props, with sensible defaults for optional ones.

**2. State Management**

```javascript
const [isReady, setIsReady] = useState(false);  // SDK loaded and mounted?
const [error, setError] = useState(null);       // Any error messages?

const mountedRef = useRef(false);               // Is the uploader mounted?
const elementIdRef = useRef(elementId);         // Current element ID
const existingFilesRef = useRef(null);          // Previous files for comparison
```

Uses both `useState` (for re-renders) and `useRef` (for values that don't need re-renders).

**3. Smart Memoization (Performance Optimization)**

```javascript
const existingFiles = useMemo(() => {
  return config.existingFiles || [];
}, [
  config.existingFiles?.length,
  config.existingFiles?.[0]?.Id || config.existingFiles?.[0]?.id
]);
```

**Why?** Prevents unnecessary re-renders by only updating when:

* The number of files changes
* The first file's ID changes (indicates different files)

This is crucial for performance in lists where many file uploaders are rendered.

**4. SDK Initialization and Mounting**

```javascript
useEffect(() => {
  let mounted = true;  // Flag to prevent state updates after unmount

  const mountFileField = async () => {
    try {
      // Wait up to 5 seconds for ApperSDK to load
      let attempts = 0;
      const maxAttempts = 50;

      while (!window.ApperSDK && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }
      
      if (!window.ApperSDK) {
        throw new Error('ApperSDK not loaded...');
      }

      // Safety check: don't proceed if component unmounted during wait
      if (!mounted) return;

      // Mount the file field
      const { ApperFileUploader } = window.ApperSDK;
      await ApperFileUploader.FileField.mount(elementIdRef.current, {
        ...config,
        existingFiles: existingFiles
      });

      if (mounted) {
        mountedRef.current = true;
        setIsReady(true);
      }
    } catch (err) {
      if (mounted) {
        setError(err.message);
      }
    }
  };

  mountFileField();

  // Cleanup: unmount when component is destroyed
  return () => {
    mounted = false;
    if (mountedRef.current && window.ApperSDK) {
      window.ApperSDK.ApperFileUploader.FileField.unmount(elementIdRef.current);
      mountedRef.current = false;
    }
  };
}, [elementId, config.existingFiles]);
```

**Key Points:**

* Waits for SDK to load (up to 5 seconds)
* Uses `mounted` flag to prevent memory leaks
* Automatically cleans up on unmount
* Handles errors gracefully

**5. Dynamic File Updates (Without Remounting)**

```javascript
useEffect(() => {
  if (!isReady || !window.ApperSDK || !config.fieldKey) return;
  
  // Only update if files actually changed
  const filesChanged = JSON.stringify(existingFilesRef.current) !== JSON.stringify(existingFiles);
  if (!filesChanged) return;

  existingFilesRef.current = existingFiles;

  if (existingFiles && existingFiles.length > 0) {
    const { ApperFileUploader } = window.ApperSDK;
    
    // Convert API format to UI format if needed
    const filesToUpdate = existingFiles[0]?.Id !== undefined
      ? ApperFileUploader.toUIFormat(existingFiles)
      : existingFiles;
    
    ApperFileUploader.FileField.updateFiles(config.fieldKey, filesToUpdate);
  } else if (existingFiles.length === 0) {
    // Clear all files
    ApperFileUploader.FileField.clearField(config.fieldKey);
  }
  }, [existingFiles, isReady, config.fieldKey]);
```

**Key Points:**

* Only runs after component is ready
* Compares files using JSON to detect real changes
* Handles format conversion (API format with uppercase keys → UI format with lowercase keys)
* Clears files when empty array is passed

**6. Error Display**

```javascript
if (error) {
  return (
    <div className={`apper-file-field-error ${className}`} style={{...}}>
      <strong>Error loading file field:</strong> {error}
    </div>
  );
}
```

Shows a styled error message if initialization fails.

**7. Loading State**

```javascript
{!isReady && (
  <div style={{ /* centered container */ }}>
    <div style={{ /* spinner animation */ }} />
    <div>Loading file uploader...</div>
  </div>
)}
```

Displays a loading spinner while SDK loads and mounts.

#### Summary: Why This Implementation Works

This wrapper component solves several critical challenges:


1. **Async SDK Loading** - Handles the CDN script loading gracefully with timeout
2. **Memory Leak Prevention** - Uses `mounted` flag and proper cleanup to prevent state updates on unmounted components
3. **Performance Optimization** - Memoizes files and compares deeply to avoid unnecessary re-mounts
4. **Format Flexibility** - Automatically converts between API and UI file formats
5. **User Experience** - Provides loading and error states for better feedback
6. **Developer Experience** - Reduces integration from 30+ lines to just a simple component tag

**File Location in Project:**

```
src/components/atoms/FileUploader/ApperFileFieldComponent.jsx
```


---

#### Component Props

| Prop | Type | Required | Description |
|----|----|----|----|
| `elementId` | String | Yes | Unique identifier for the uploader instance |
| `config` | Object | Yes | Configuration object (same as ApperFileUploader config) |
| `className` | String | No | Custom CSS class for styling |
| `style` | Object | No | Inline styles for the container |

#### Configuration Object

The `config` prop accepts all standard ApperFileUploader configuration options:

```javascript
{
  fieldKey: 'unique-field-id',              // Required: Field identifier
  tableName: 'contacts',                   // Database table name
  fieldName: 'attachments',                // Database field name
  apperProjectId: 'your_project_id',       // Your Apper project ID
  apperPublicKey: 'your_public_key',       // Your Apper public key
  existingFiles: [],                       // Previously uploaded files
  fileCount: 5,                            // Max number of files
  maxFileSize: 10 * 1024 * 1024,          // Max file size (bytes)
  supportedExtensions: ['pdf', 'jpg'],     // Allowed file types
  showUploadedFilesInPopOver: false,       // Show files in popover
  uploadButtonConfig: {                    // Button customization
    hidden: false,
    disabled: false,
    iconOnly: false
  },
  purpose: 'RecordAttachment',             // Upload purpose
  onUploadedFilesChanged: (files) => {}    // Callback when files change
}
```

#### Basic Usage

```javascript
import React from 'react';
import ApperFileFieldComponent from './components/atoms/FileUploader/ApperFileFieldComponent';

const MyComponent = () => {
  return (
    <ApperFileFieldComponent
      elementId="contact-files"
      config={{
        fieldKey: 'contact-files',
        tableName: 'contacts',
        fieldName: 'attachments',
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
        existingFiles: [],
        fileCount: 5,
        purpose: 'RecordAttachment'
      }}
    />
  );
};
```

#### Key Features Explained

**1. Automatic SDK Loading**

The component waits for the ApperSDK to load before mounting:

```javascript
// Automatically handled internally - no manual setup needed
while (!window.ApperSDK && attempts < maxAttempts) {
  await new Promise(resolve => setTimeout(resolve, 100));
  attempts++;
}
```

**2. Smart Memoization**

Prevents unnecessary re-renders by only updating when files actually change:

```javascript
// Uses useMemo to detect real changes
const existingFiles = useMemo(() => {
  return config.existingFiles || [];
}, [
  config.existingFiles?.length,
  config.existingFiles?.[0]?.Id || config.existingFiles?.[0]?.id
]);
```

**3. Proper Cleanup**

Automatically unmounts the file field when component is destroyed:

```javascript
// Cleanup is handled automatically
useEffect(() => {
  // ... mount logic
  
  return () => {
    // Unmount when component unmounts
    window.ApperSDK.ApperFileUploader.FileField.unmount(elementId);
  };
}, [elementId]);
```

**4. Error Handling**

Shows user-friendly error messages if initialization fails:

```javascript
if (error) {
  return (
    <div className="apper-file-field-error">
      <strong>Error loading file field:</strong> {error}
    </div>
  );
}
```

**5. Loading State**

Displays a loading spinner while the SDK initializes:

```javascript
{!isReady && (
  <div>
    <div style={{ /* spinner styles */ }} />
    <div>Loading file uploader...</div>
  </div>
)}
```

#### Advantages Over Direct SDK Usage

| Direct SDK Usage | ApperFileFieldComponent |
|----|----|
| Manual SDK loading check | ✅ Automatic SDK loading |
| Manual mount/unmount | ✅ Auto mount/unmount |
| No error handling | ✅ Built-in error UI |
| No loading state | ✅ Loading spinner |
| Manual cleanup required | ✅ Automatic cleanup |
| Manual file updates | ✅ Smart updates |
| \~30-50 lines of code | ✅ 5-10 lines of code |

### Remove Scenario: Deleting Files

Files can be removed by the user through the UI, or programmatically:

```javascript
// User removes file through UI - handled automatically via onUploadedFilesChanged

// Programmatic removal - clear all files
const clearFiles = (fieldKey) => {
  const { ApperFileUploader } = window.ApperSDK;
  ApperFileUploader.FileField.clearField(fieldKey);
};

// Update with empty array
const removeAllFiles = (fieldKey) => {
  const { ApperFileUploader } = window.ApperSDK;
  ApperFileUploader.FileField.updateFiles(fieldKey, []);
};
```


---

## Integration Scenarios

The following scenarios demonstrate real-world usage of the `ApperFileFieldComponent` wrapper in different contexts. All examples use the wrapper component for simplified integration and better code maintainability.

**Note:** These examples use the `ApperFileFieldComponent` wrapper instead of directly calling the ApperSDK, which significantly reduces boilerplate code and handles SDK initialization, mounting, unmounting, and error handling automatically.

### Scenario 1: Record Creation with File Field

**Use Case:** Creating a new contact with document attachments.

```javascript
import React, { useState } from 'react';
import ApperFileFieldComponent from './components/atoms/FileUploader/ApperFileFieldComponent';

const CreateContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get files from the file field
    const { ApperFileUploader } = window.ApperSDK;
    const files = ApperFileUploader.FileField.getFiles('contact-files');
    
    // Submit form with files
    await onSubmit({
      ...formData,
      files: files || uploadedFiles
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          placeholder="Enter name"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Attachments</label>
        <ApperFileFieldComponent
          elementId="contact-files"
          config={{
            fieldKey: 'contact-files',
            tableName: 'contacts',
            fieldName: 'attachments',
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
            existingFiles: [],
            fileCount: 5,
            purpose: 'RecordAttachment',
            onUploadedFilesChanged: (files) => {
              setUploadedFiles(files);
            }
          }}
        />
      </div>
      
      <button type="submit" style={{ padding: '0.5rem 1rem' }}>
        Create Contact
      </button>
    </form>
  );
};

export default CreateContactForm;
```

### Scenario 2: Record Update with Existing Files

**Use Case:** Editing a contact and showing already attached files.

```javascript
import React, { useState } from 'react';
import ApperFileFieldComponent from './components/atoms/FileUploader/ApperFileFieldComponent';

const EditContactForm = ({ contact, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: contact.name,
    email: contact.email,
    phone: contact.phone
  });
  const [currentFiles, setCurrentFiles] = useState(contact.files || []);
  
  const handleUpdate = async () => {
    // Get updated files from the file field
    const { ApperFileUploader } = window.ApperSDK;
    const fieldKey = `contact-files-${contact.Id}`;
    const updatedFiles = ApperFileUploader.FileField.getFiles(fieldKey) || currentFiles;
    
    // Update contact with new data and files
    await onUpdate(contact.Id, {
      ...formData,
      files: updatedFiles
    });
  };
  
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Edit Contact</h2>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="edit-name">Name</label>
        <input
          id="edit-name"
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="edit-email">Email</label>
        <input
          id="edit-email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
        />
      </div>
      
      <div style={{ marginBottom: '1rem' }}>
        <label>Attachments</label>
        <ApperFileFieldComponent
          elementId={`contact-files-${contact.Id}`}
          config={{
            fieldKey: `contact-files-${contact.Id}`,
            tableName: 'contacts',
            fieldName: 'attachments',
            apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
            apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
            existingFiles: contact.files || [], // Show existing files
            fileCount: 5,
            purpose: 'RecordAttachment',
            onUploadedFilesChanged: (files) => {
              setCurrentFiles(files);
            }
          }}
        />
      </div>
      
      <button onClick={handleUpdate} style={{ padding: '0.5rem 1rem' }}>
        Save Changes
      </button>
    </div>
  );
};

export default EditContactForm;
```

### Scenario 3: ListView with File Uploader

**Use Case:** Display file uploaders in a table row for inline file management.

```javascript
import React, { useState, useEffect } from 'react';
import ApperFileFieldComponent from './components/atoms/FileUploader/ApperFileFieldComponent';

const ContactTableRow = ({ contact, onUpdate, onRowClick }) => {
  const [originalFiles, setOriginalFiles] = useState(contact.files || []);
  const [currentFiles, setCurrentFiles] = useState(contact.files || []);
  const [isSaving, setIsSaving] = useState(false);
  
  // Update files when contact data changes
  useEffect(() => {
    setOriginalFiles(contact.files || []);
    setCurrentFiles(contact.files || []);
  }, [contact.Id, contact.files?.length]);
  
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { ApperFileUploader } = window.ApperSDK;
      const fieldKey = `files-${contact.Id}`;
      
      // Get current files from uploader
      const updatedFiles = ApperFileUploader.FileField.getFiles(fieldKey) || currentFiles;
      
      // Update contact with new files
      await onUpdate(contact.Id, { files: updatedFiles });
      
      // Update local state
      setOriginalFiles(updatedFiles);
    } catch (error) {
      console.error('Failed to save files:', error);
      alert('Failed to save files. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <tr onClick={onRowClick} style={{ cursor: 'pointer' }}>
      <td style={{ padding: '0.75rem' }}>{contact.name}</td>
      <td style={{ padding: '0.75rem' }}>{contact.email}</td>
      <td style={{ padding: '0.75rem' }}>{contact.phone}</td>
      
      <td 
        onClick={(e) => e.stopPropagation()} 
        style={{ padding: '0.75rem' }}
      >
        {/* File uploader in table cell */}
        <div style={{ minWidth: '200px', maxWidth: '300px' }}>
          <ApperFileFieldComponent
            elementId={`files-${contact.Id}`}
            config={{
              fieldKey: `files-${contact.Id}`,
              tableName: 'contacts',
              fieldName: 'attachments',
              apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
              apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
              existingFiles: originalFiles,
              showUploadedFilesInPopOver: true, // Use popover in tables
              fileCount: 3,
              uploadButtonConfig: {
                hidden: false,
                disabled: false,
                iconOnly: true // Icon-only button saves space
              },
              purpose: 'RecordAttachment',
              onUploadedFilesChanged: (files) => {
                setCurrentFiles(files);
              }
            }}
          />
        </div>
      </td>
      
      <td style={{ padding: '0.75rem' }}>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isSaving ? '#9ca3af' : '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '0.25rem',
            cursor: isSaving ? 'not-allowed' : 'pointer'
          }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </td>
    </tr>
  );
};

export default ContactTableRow;
```

**Key Points for ListView Integration:**

* ✅ Use `showUploadedFilesInPopOver: true` to save space and show files in a compact popover
* ✅ Set `uploadButtonConfig.iconOnly: true` for compact icon-only buttons
* ✅ Use `onClick={(e) => e.stopPropagation()` on the file cell to prevent row click events from firing
* ✅ Set `minWidth` and `maxWidth` on the container to prevent layout shifts
* ✅ Track file changes with `onUploadedFilesChanged` callback
* ✅ Lower file size limits for better performance in tables (5MB instead of 10MB)
* ✅ Limit `fileCount` to keep the UI clean (3 files max)
* ✅ Show loading state on the save button for better UX


---

## Best Practices

### 1. Use the ApperFileFieldComponent Wrapper

**✅ DO:**

```javascript
// Use the wrapper component for easier integration
import ApperFileFieldComponent from './components/atoms/FileUploader/ApperFileFieldComponent';

const MyForm = () => (
  <ApperFileFieldComponent
    elementId="my-files"
    config={{
      fieldKey: 'my-files',
      tableName: 'contacts',
      fieldName: 'attachments',
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      existingFiles: [],
      fileCount: 5
    }}
  />
);
```

**❌ DON'T:**

```javascript
// Don't manually handle all the mounting/unmounting logic
// unless you have a specific reason to do so
useEffect(() => {
  const init = async () => {
    while (!window.ApperSDK) {
      await new Promise(r => setTimeout(r, 100));
    }
    // ... 30+ lines of boilerplate code
    await ApperFileUploader.FileField.mount(...);
  };
  init();
  
  return () => {
    // Manual cleanup
    ApperFileUploader.FileField.unmount(...);
  };
}, []);
```

**Why use the wrapper?**

* Reduces code from 30-50 lines to 5-10 lines
* Automatic error handling and loading states
* Prevents memory leaks with automatic cleanup
* Smart updates to avoid unnecessary re-renders
* Production-ready and battle-tested

### 2. State Management

**✅ DO:**

```javascript
// Use state to track uploaded files
const [files, setFiles] = useState([]);

// Update state when files change
onUploadedFilesChanged: (newFiles) => {
  setFiles(newFiles);
}
```

**❌ DON'T:**

```javascript
// Don't store files in local variables
let files = [];

// Don't forget to update parent component
onUploadedFilesChanged: (newFiles) => {
  // Missing state update!
}
```

### 2. Handling Large Files

**✅ DO:**

```javascript
// Set reasonable file size limits
maxFileSize: 50 * 1024 * 1024, // 50MB

// Show progress feedback
onProgress: (progress) => {
  setUploadProgress(progress);
  // Update UI to show progress bar
},

// Handle errors gracefully
onError: (error) => {
  console.error('Upload failed:', error);
  setErrorMessage('File upload failed. Please try again.');
}
```

**❌ DON'T:**

```javascript
// Don't allow unlimited file sizes
maxFileSize: undefined, // Bad!

// Don't ignore progress updates
// Users need feedback for large uploads
```

### 3. Clean UI & UX

**✅ DO:**

```javascript
supportedExtensions: ['pdf', 'jpg', 'png'],
maxFileSize: 10 * 1024 * 1024,

// Provide helpful titles and descriptions
title: 'Upload Resume',
description: 'PDF or Word documents, max 10MB',

// Show loading states
{!isReady && <div>Loading uploader...</div>}
```

**❌ DON'T:**

```javascript
// Don't use vague messaging
title: 'Upload', // Not specific enough
description: 'Select file' // Too generic
```

### 4. Optimizing Performance

**✅ DO:**

```javascript
// Memoize existing files to prevent unnecessary re-renders
const existingFiles = useMemo(() => {
  return contact.files || [];
}, [contact.files?.length, contact.files?.[0]?.id]);

// Cleanup on unmount
useEffect(() => {
  return () => {
    ApperFileUploader.FileField.unmount(elementId);
  };
}, []);

// Use refs for values that don't need to trigger re-renders
const apperClientRef = useRef(null);
```

**❌ DON'T:**

```javascript
// Don't remount unnecessarily
useEffect(() => {
  mountFileField();
}, [someUnrelatedValue]); // Causes unnecessary remounts

// Don't forget to unmount
// This causes memory leaks!
```

### 5. Error Handling

**✅ DO:**

```javascript
const [error, setError] = useState(null);

try {
  await ApperFileUploader.FileField.mount(elementId, config);
  setError(null);
} catch (err) {
  console.error('Failed to mount:', err);
  setError(err.message);
}

// Show error to user
if (error) {
  return <div className="error">{error}</div>;
}
```

**❌ DON'T:**

```javascript
// Don't silently fail
try {
  await ApperFileUploader.FileField.mount(elementId, config);
} catch (err) {
  // Empty catch block - user has no idea what happened!
}
```

### 6. Multiple File Fields

When using multiple file fields on the same page:

**✅ DO:**

```javascript
// Use unique field IDs
<ApperFileFieldComponent
  elementId={`files-1-${recordId}`}
  config={{ fieldKey: `files-1-${recordId}`, ... }}
/>

<ApperFileFieldComponent
  elementId={`files-2-${recordId}`}
  config={{ fieldKey: `files-2-${recordId}`, ... }}
/>
```

**❌ DON'T:**

```javascript
// Don't reuse field IDs
<ApperFileFieldComponent
  elementId="files" // Same ID! Will cause conflicts
  config={{ fieldKey: "files", ... }}
/>
```


---

## Troubleshooting & Common Issues

### Issue 1: "ApperSDK not loaded" Error

**Problem:** The component tries to use ApperSDK before it's loaded.

**Solution:**

```javascript
// Wait for SDK to load
useEffect(() => {
  const waitForSDK = async () => {
    let attempts = 0;
    const maxAttempts = 50;
    
    while (!window.ApperSDK && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!window.ApperSDK) {
      throw new Error('ApperSDK failed to load');
    }
    
    // Now safe to use SDK
  };
  
  waitForSDK();
}, []);
```

### Issue 2: Files Not Appearing After Upload

**Problem:** Files upload but don't show in the UI.

**Solution:**

```javascript
// Make sure you're updating state
onUploadedFilesChanged: (files) => {
  setUploadedFiles(files); // Don't forget this!
},

// Or use getFiles to retrieve them
const files = ApperFileUploader.FileField.getFiles(fieldKey);
setUploadedFiles(files);
```

### Issue 3: Existing Files Not Showing

**Problem:** When editing a record, existing files don't appear.

**Solution:**

```javascript
// Check if files are in correct format
// API format: { Id, Name, Size, Type, Url }
// UI format: { id, name, size, type, url }

// Convert if needed
const { ApperFileUploader } = window.ApperSDK;
const uiFiles = ApperFileUploader.toUIFormat(apiFiles);

// Pass to config
existingFiles: uiFiles
```

### Issue 4: File Upload Fails

**Problem:** Upload starts but fails with an error.

**Common Causes & Solutions:**


1. **Invalid credentials:**

```javascript
// Check your environment variables
console.log('Project ID:', import.meta.env.VITE_APPER_PROJECT_ID);
console.log('Public Key:', import.meta.env.VITE_APPER_PUBLIC_KEY);
```


2. **File too large:**

```javascript
// Check file size limits
maxFileSize: 10 * 1024 * 1024, // 10MB
// Make sure uploaded file is smaller
```


3. **Invalid file type:**

```javascript
// Check supported extensions
supportedExtensions: ['pdf', 'jpg', 'png'],
// Make sure file type is in the list
```

### Issue 5: Memory Leaks

**Problem:** App becomes slow over time with multiple file fields.

**Solution:**

```javascript
// Always unmount when component unmounts
useEffect(() => {
  // Mount logic here
  
  return () => {
    // Cleanup
    if (window.ApperSDK) {
      ApperFileUploader.FileField.unmount(elementId);
    }
  };
}, []);
```

### Issue 6: Multiple Uploads Conflict

**Problem:** When multiple file fields are open, uploads interfere with each other.

**Solution:**

```javascript
// Use unique field IDs
const uniqueFieldKey = `files-${fieldName}-${recordId}-${Math.random()}`;

<ApperFileFieldComponent
  elementId={uniqueFieldKey}
  config={{ fieldKey: uniqueFieldKey, ... }}
/>
```

### Issue 7: Files Don't Update Dynamically

**Problem:** When `existingFiles` prop changes, UI doesn't update.

**Solution:**

```javascript
// Make sure you're detecting changes correctly
useEffect(() => {
  if (!isReady) return;
  
  const { ApperFileUploader } = window.ApperSDK;
  ApperFileUploader.FileField.updateFiles(fieldKey, existingFiles);
}, [existingFiles, isReady, fieldKey]);

// Use JSON comparison for deep equality
const filesChanged = JSON.stringify(prevFiles) !== JSON.stringify(newFiles);
```


---

## Quick Reference

### Import the Components

**Recommended: Use the Wrapper Component**

```javascript
import ApperFileFieldComponent from './components/atoms/FileUploader/ApperFileFieldComponent';
```

**Alternative: Direct SDK Access**

```javascript
// Global SDK access (when you need lower-level control)
const { ApperFileUploader, ApperClient } = window.ApperSDK;
```

### Initialize ApperClient

```javascript
const apperClient = new ApperClient({
  apperProjectId: 'your_project_id',
  apperPublicKey: 'your_public_key'
});
```

### Common Operations

```javascript
// Mount file field
await ApperFileUploader.FileField.mount('element-id', config);

// Get files from field
const files = ApperFileUploader.FileField.getFiles('field-key');

// Update files
ApperFileUploader.FileField.updateFiles('field-key', newFiles);

// Clear files
ApperFileUploader.FileField.clearField('field-key');

// Unmount field
ApperFileUploader.FileField.unmount('element-id');

// Convert file formats
const uiFiles = ApperFileUploader.toUIFormat(apiFiles);
```


---

