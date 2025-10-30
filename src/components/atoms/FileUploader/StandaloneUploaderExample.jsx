/**
 * Standalone File Uploader Example
 * 
 * A simple React component showing how to use ApperFileUploader
 * without associating it with any Apper file field.
 */

import React, { useEffect, useState, useRef } from 'react';

const StandaloneUploaderExample = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const apperClientRef = useRef(null);

  // Initialize ApperClient
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

  // Show the file uploader
  useEffect(() => {
    if (!isReady || !window.ApperSDK) return;

    const showUploader = async () => {
      const { ApperFileUploader } = window.ApperSDK;

      const config = {
        // Existing files to display (optional)
        existingFiles: uploadedFiles,
        
        // Callback when files change (upload/delete)
        onUploadedFilesChanged: (files) => {
          setUploadedFiles(files);
        },
        
        // Show uploaded files in popover (default: true)
        showUploadedFilesInPopOver: false,
        
        // Maximum number of files allowed (default: 3)
        fileCount: 3,
        
        // File purpose/type (default: 'RecordAttachment')
        purpose: 'RecordAttachment',
        
        // Upload configuration (required)
        uploadConfig: {
          apperClient: apperClientRef.current,
          purpose: 'RecordAttachment',
          canvasUniqueId: import.meta.env.VITE_APPER_PROJECT_ID, // Optional
          isExternal: false // Optional: whether files are external links
        },
        
        // Upload button configuration (optional)
        uploadButtonConfig: {
          hidden: false,
          disabled: false,
        },
        
        // UI Configuration (optional)
        title: 'Upload File',
        description: 'Select files to upload',
        allowMultiple: true,
        maxFiles: 5,
        maxFileSize: 100 * 1024 * 1024, // 10MB in bytes
        supportedExtensions: ['pdf', 'jpg', 'jpeg', 'png', 'docx', 'xlsx'],
        showRestrictions: true,
        autoUpload: true,
        
        // Callback functions (optional)
        onSuccess: (results) => {
          console.log('Upload successful:', results);
        },
        onError: (error) => {
          console.error('Upload failed:', error);
        },
        onProgress: (progress) => {
          console.log('Upload progress:', progress + '%');
        }
      };

      await ApperFileUploader.showFileUploader('standalone-uploader', config);
    };

    showUploader();
  }, [isReady, uploadedFiles]);

  return (
    <div>
      <div id="standalone-uploader"  />
    </div>
  );
};

export default StandaloneUploaderExample;

