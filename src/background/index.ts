// src/background/index.ts
import { QueueOrchestrator } from '../core/queueOrchestrator';

// Listen for messages from the Popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'LAUNCH_WORKSPACE') {
    const { urls } = request.payload;
    
    // Trigger the engine
    QueueOrchestrator.addAndProcess(urls);
    
    sendResponse({ status: 'Launched' });
  }
  return true;
});
