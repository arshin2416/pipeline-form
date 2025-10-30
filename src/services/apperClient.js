/**
 * Singleton class to manage ApperClient instance
 * Prevents multiple SDK initializations
 */
class ApperClientSingleton {
  constructor() {
    this._client = null;
    this._isInitializing = false;
    this._sdkCheckAttempts = 0;
  }

  /**
   * Wait for ApperSDK to be available on window object
   * @param {number} maxWaitTime - Maximum time to wait in milliseconds
   * @returns {Promise<boolean>} - True if SDK is available
   */
  async waitForSDK(maxWaitTime = 10000) {
    const startTime = Date.now();
    const checkInterval = 100; // Start with 100ms intervals
    
    while (Date.now() - startTime < maxWaitTime) {
      if (window.ApperSDK) {
        console.info('ApperSDK loaded successfully');
        return true;
      }
      
      // Exponential backoff: 100ms, 200ms, 400ms, 800ms, then 1000ms max
      const waitTime = Math.min(checkInterval * Math.pow(2, this._sdkCheckAttempts), 1000);
      await new Promise(resolve => setTimeout(resolve, waitTime));
      this._sdkCheckAttempts++;
    }
    
    return false;
  }

  /**
   * Check if SDK script tag exists in DOM
   */
  checkSDKScript() {
    const cdnUrl = import.meta.env.VITE_APPER_SDK_CDN_URL;
    
    if (!cdnUrl) {
      console.error('CRITICAL: VITE_APPER_SDK_CDN_URL environment variable is not set');
      return false;
    }
    
    const scripts = document.getElementsByTagName('script');
    const sdkScriptExists = Array.from(scripts).some(script => 
      script.src && script.src.includes('apper-sdk')
    );
    
    if (!sdkScriptExists) {
      console.error(
        'CRITICAL: ApperSDK script tag is missing from index.html\n' +
        'Please add the following to the <head> section of index.html:\n' +
        '<script src="%VITE_APPER_SDK_CDN_URL%"></script>\n' +
        `Expected URL: ${cdnUrl}`
      );
      return false;
    }
    
    return true;
  }

  async getInstance() {
    // Return cached instance if exists
    if (this._client) {
      return this._client;
    }

    // Prevent simultaneous initialization
    if (this._isInitializing) {
      console.warn('ApperClient initialization already in progress');
      return null;
    }

    try {
      this._isInitializing = true;

      // Check if SDK script tag exists in DOM
      if (!this.checkSDKScript()) {
        console.error('Failed to initialize ApperSDK or ApperClient: SDK script not found in DOM');
        return null;
      }

      // Wait for SDK to be available
      const sdkAvailable = await this.waitForSDK();
      
      if (!sdkAvailable || !window.ApperSDK) {
        console.error(
          'Failed to initialize ApperSDK or ApperClient: SDK did not load within timeout period\n' +
          'Possible causes:\n' +
          '1. Network issue preventing SDK download\n' +
          '2. CDN URL is incorrect\n' +
          '3. SDK script tag placed after React app initialization'
        );
        return null;
      }

      const { ApperClient } = window.ApperSDK;
      const projectId = import.meta.env.VITE_APPER_PROJECT_ID;
      const publicKey = import.meta.env.VITE_APPER_PUBLIC_KEY;

      if (!projectId) {
        console.error('CRITICAL: VITE_APPER_PROJECT_ID environment variable is required');
        return null;
      }

      console.info('Initializing ApperClient with project:', projectId);

      this._client = new ApperClient({
        apperProjectId: projectId,
        apperPublicKey: publicKey,
      });

      console.info('ApperClient initialized successfully');
      return this._client;
      
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
      console.error('Error stack:', error.stack);
      return null;
    } finally {
      this._isInitializing = false;
    }
  }

  /**
   * Synchronous getter for cases where SDK must be immediately available
   * Returns null if SDK not ready - calling code should handle gracefully
   */
  getInstanceSync() {
    if (this._client) {
      return this._client;
    }

    if (!window.ApperSDK) {
      console.warn('ApperSDK not available on window object - use async getInstance() instead');
      return null;
    }

    if (this._isInitializing) {
      return null;
    }

    try {
      this._isInitializing = true;
      
      const { ApperClient } = window.ApperSDK;
      const projectId = import.meta.env.VITE_APPER_PROJECT_ID;
      const publicKey = import.meta.env.VITE_APPER_PUBLIC_KEY;

      if (!projectId) {
        console.error('VITE_APPER_PROJECT_ID is required');
        return null;
      }

      this._client = new ApperClient({
        apperProjectId: projectId,
        apperPublicKey: publicKey,
      });

      return this._client;
    } catch (error) {
      console.error('Failed to initialize ApperClient:', error);
      return null;
    } finally {
      this._isInitializing = false;
    }
  }

  reset() {
    if (this._client) {
      this._client = null;
    }
    this._sdkCheckAttempts = 0;
  }
}

let _singletonInstance = null;

const getSingleton = () => {
  if (!_singletonInstance) {
    _singletonInstance = new ApperClientSingleton();
  }
  return _singletonInstance;
};

// Async version - recommended for most use cases
export const getApperClient = async () => {
  return await getSingleton().getInstance();
};

// Sync version - for cases where SDK must be immediately available
export const getApperClientSync = () => getSingleton().getInstanceSync();

export const apperClientSingleton = {
  getInstance: async () => await getSingleton().getInstance(),
  getInstanceSync: () => getSingleton().getInstanceSync(),
  reset: () => getSingleton().reset(),
};

export default getSingleton;