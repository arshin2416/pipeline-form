

import React, { useEffect, useState, useRef, useMemo } from 'react';

const ApperFileFieldComponent = ({ 
  elementId, 
  config = {},
  className = '',
  style = {}
}) => {
  
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const mountedRef = useRef(false);
  const elementIdRef = useRef(elementId);
  const existingFilesRef = useRef(null);

  // Memoize existingFiles to detect actual changes
  const existingFiles = useMemo(() => {
    
    return config.existingFiles || [];
  }, [
    config.existingFiles?.length,
    config.existingFiles?.[0]?.Id || config.existingFiles?.[0]?.id
  ]);

  useEffect(() => {
    // Update ref if elementId changes
    elementIdRef.current = elementId;
  }, [elementId]);

  useEffect(() => {
    let mounted = true;

    const mountFileField = async () => {
      
      try {
        // Wait for ApperSDK to be available
        let attempts = 0;
        const maxAttempts = 50;

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

        elementIdRef.current = `file-uploader-${elementId}`;
       
        // Mount the file field with the full config including existingFiles
        await ApperFileUploader.FileField.mount(elementIdRef.current, {
          ...config,
          // Use memoized existingFiles
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

    // Cleanup function
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
  }, [elementId, config.existingFiles]); // Only re-mount if elementId changes

  // Update files when existingFiles change (without remounting)
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
        
        // Check if files need conversion from API format
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

