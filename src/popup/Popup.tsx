import React, { useState } from 'react';

export const Popup = () => {
  const [urls, setUrls] = useState('');

  const handleLaunch = () => {
    const urlList = urls.split('\n').filter(u => u.trim() !== '');
    // Send message to background script
    chrome.runtime.sendMessage({
      action: 'LAUNCH_WORKSPACE',
      payload: { urls: urlList }
    });
  };

  return (
    <div style={{ width: '300px', padding: '20px' }}>
      <h2>LaunchFlow</h2>
      <textarea 
        rows={10} 
        style={{ width: '100%' }}
        placeholder="Paste your URLs here (one per line)..."
        value={urls}
        onChange={(e) => setUrls(e.target.value)}
      />
      <button onClick={handleLaunch} style={{ marginTop: '10px', width: '100%' }}>
        Launch Workspace
      </button>
    </div>
  );
};
