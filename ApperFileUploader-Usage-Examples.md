# 📗 ApperFileUploader - Usage Examples, Integration & Best Practices

## Table of Contents

1. [Basic Usage Example](#basic-usage-example)
2. [Handling File Uploads](#handling-file-uploads)
3. [Integration Scenarios](#integration-scenarios)
4. [Best Practices](#best-practices)
5. [Troubleshooting & Common Issues](#troubleshooting--common-issues)

---

## Basic Usage Example

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
|------|------|-------------|---------|
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

### Create Scenario: New Record with Files

When creating a new record with files:

```javascript
const CreateRecordWithFiles = () => {
  const [pendingFiles, setPendingFiles] = useState([]);
  
  const handleSubmit = async (formData) => {
    try {
      // Step 1: Create the record first
      const newRecord = await createRecord({
        name: formData.name,
        email: formData.email
      });
      
      // Step 2: Associate uploaded files with the record
      if (pendingFiles.length > 0) {
        await associateFilesWithRecord(newRecord.id, pendingFiles);
      }
      
      console.log('Record created with files:', newRecord);
    } catch (error) {
      console.error('Failed to create record:', error);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      
      {/* File uploader */}
      <div id="file-uploader" />
    </form>
  );
};
```

### Update Scenario: Existing Record with Files

When editing an existing record and showing its files:

```javascript
const EditRecordWithFiles = ({ recordId, existingFiles }) => {
  const [currentFiles, setCurrentFiles] = useState(existingFiles);
  
  useEffect(() => {
    if (!window.ApperSDK) return;
    
    const { ApperFileUploader } = window.ApperSDK;
    
    // Mount the file field
    const config = {
      fieldId: `files_${recordId}`,
      tableNameOrId: 'contacts',
      fieldNameOrId: 'attachments',
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
      existingFiles: currentFiles,
      onUploadedFilesChanged: (files) => {
        setCurrentFiles(files);
      }
    };
    
    ApperFileUploader.FileField.mount('file-field', config);
    
    // Cleanup
    return () => {
      ApperFileUploader.FileField.unmount('file-field');
    };
  }, [recordId]);
  
  const handleSave = async () => {
    // Get updated files from the file field
    const fieldId = `files_${recordId}`;
    const updatedFiles = ApperFileUploader.FileField.getFiles(fieldId);
    
    // Update record with new files
    await updateRecord(recordId, { files: updatedFiles });
  };
  
  return (
    <div>
      <div id="file-field" />
      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
};
```

### Remove Scenario: Deleting Files

Files can be removed by the user through the UI, or programmatically:

```javascript
// User removes file through UI - handled automatically via onUploadedFilesChanged

// Programmatic removal - clear all files
const clearFiles = (fieldId) => {
  const { ApperFileUploader } = window.ApperSDK;
  ApperFileUploader.FileField.clearField(fieldId);
};

// Update with empty array
const removeAllFiles = (fieldId) => {
  const { ApperFileUploader } = window.ApperSDK;
  ApperFileUploader.FileField.updateFiles(fieldId, []);
};
```

---

## Integration Scenarios

### Scenario 1: Record Creation with File Field

**Use Case:** Creating a new contact with document attachments.

```javascript
import React, { useState } from 'react';
import ApperFileFieldComponent from './ApperFileFieldComponent';

const CreateContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get files from the file field
    const { ApperFileUploader } = window.ApperSDK;
    const files = ApperFileUploader.FileField.getFiles('contact-files');
    
    // Submit form with files
    await onSubmit({
      ...formData,
      files: files
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({...formData, email: e.target.value})}
      />
      
      <ApperFileFieldComponent
        elementId="contact-files"
        config={{
          fieldId: 'contact-files',
          tableNameOrId: 'contacts',
          fieldNameOrId: 'attachments',
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
          existingFiles: [],
          fileCount: 5,
          purpose: 'RecordAttachment'
        }}
      />
      
      <button type="submit">Create Contact</button>
    </form>
  );
};
```

### Scenario 2: Record Update with Existing Files

**Use Case:** Editing a contact and showing already attached files.

```javascript
const EditContactForm = ({ contact, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: contact.name,
    email: contact.email
  });
  
  const handleUpdate = async () => {
    // Get updated files
    const { ApperFileUploader } = window.ApperSDK;
    const fieldId = `contact-files-${contact.Id}`;
    const updatedFiles = ApperFileUploader.FileField.getFiles(fieldId);
    
    // Update contact
    await onUpdate(contact.Id, {
      ...formData,
      files: updatedFiles
    });
  };
  
  return (
    <div>
      <input
        type="text"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
      />
      
      <ApperFileFieldComponent
        elementId={`contact-files-${contact.Id}`}
        config={{
          fieldId: `contact-files-${contact.Id}`,
          tableNameOrId: 'contacts',
          fieldNameOrId: 'attachments',
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY,
          existingFiles: contact.files || [], // Show existing files
          fileCount: 5
        }}
      />
      
      <button onClick={handleUpdate}>Save Changes</button>
    </div>
  );
};
```

### Scenario 3: ListView with File Uploader

**Use Case:** Display file uploaders in a table row (like in ContactRow.jsx).

```javascript
const ContactTableRow = ({ contact, onUpdate }) => {
  const [originalFiles, setOriginalFiles] = useState(contact.files || []);
  
  useEffect(() => {
    setOriginalFiles(contact.files || []);
  }, [contact.Id]);
  
  const handleSave = async () => {
    const { ApperFileUploader } = window.ApperSDK;
    const fieldId = `files-${contact.Id}`;
    
    // Get current files from uploader
    const updatedFiles = ApperFileUploader.FileField.getFiles(fieldId) || [];
    
    // Update contact
    await onUpdate(contact.Id, { files: updatedFiles });
  };
  
  return (
    <tr>
      <td>{contact.name}</td>
      <td>{contact.email}</td>
      <td onClick={(e) => e.stopPropagation()}>
        {/* File uploader in table cell */}
        <div style={{ minWidth: '200px' }}>
          <ApperFileFieldComponent
            elementId={`files-${contact.Id}`}
            config={{
              fieldId: `files-${contact.Id}`,
              tableNameOrId: 'contacts',
              fieldNameOrId: 'attachments',
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
              purpose: 'RecordAttachment'
            }}
          />
        </div>
      </td>
      <td>
        <button onClick={handleSave}>Save</button>
      </td>
    </tr>
  );
};
```

**Key Points for ListView Integration:**
- Use `showUploadedFilesInPopOver: true` to save space
- Set `uploadButtonConfig.iconOnly: true` for compact buttons
- Use `onClick={(e) => e.stopPropagation()` to prevent row click events
- Set `minWidth` on the container to prevent layout shifts

---

## Best Practices

### 1. State Management

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
// Show clear file restrictions
showRestrictions: true,
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
// Don't hide restrictions from users
showRestrictions: false, // They won't know what's allowed!

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
  config={{ fieldId: `files-1-${recordId}`, ... }}
/>

<ApperFileFieldComponent
  elementId={`files-2-${recordId}`}
  config={{ fieldId: `files-2-${recordId}`, ... }}
/>
```

**❌ DON'T:**
```javascript
// Don't reuse field IDs
<ApperFileFieldComponent
  elementId="files" // Same ID! Will cause conflicts
  config={{ fieldId: "files", ... }}
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
const files = ApperFileUploader.FileField.getFiles(fieldId);
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
const uniqueFieldId = `files-${fieldName}-${recordId}-${Math.random()}`;

<ApperFileFieldComponent
  elementId={uniqueFieldId}
  config={{ fieldId: uniqueFieldId, ... }}
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
  ApperFileUploader.FileField.updateFiles(fieldId, existingFiles);
}, [existingFiles, isReady, fieldId]);

// Use JSON comparison for deep equality
const filesChanged = JSON.stringify(prevFiles) !== JSON.stringify(newFiles);
```

---

## Quick Reference Guide

### Common Operations

```javascript
// Get ApperSDK components
const { ApperFileUploader, ApperClient } = window.ApperSDK;

// Initialize client
const apperClient = new ApperClient({
  apperProjectId: 'your_project_id',
  apperPublicKey: 'your_public_key'
});

// Mount file field
await ApperFileUploader.FileField.mount('element-id', config);

// Get files from field
const files = ApperFileUploader.FileField.getFiles('field-id');

// Update files
ApperFileUploader.FileField.updateFiles('field-id', newFiles);

// Clear files
ApperFileUploader.FileField.clearField('field-id');

// Unmount field
ApperFileUploader.FileField.unmount('element-id');

// Convert file formats
const uiFiles = ApperFileUploader.toUIFormat(apiFiles);
```

---

## Additional Resources

- **ApperSDK Documentation:** [https://docs.apper.io](https://docs.apper.io)
- **Introduction Guide:** See [ApperFileUploader-Introduction.md](./ApperFileUploader-Introduction.md)
- **Support:** Contact Apper support for technical assistance

---

**Happy Coding! 🚀**

You now have everything you need to implement ApperFileUploader in your projects. Start with the basic examples and gradually incorporate more advanced features as needed.

