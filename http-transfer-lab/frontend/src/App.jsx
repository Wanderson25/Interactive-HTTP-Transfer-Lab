import React, { useState, useEffect } from 'react';
import './App.css'; 

function App() {
  const [fileSize, setFileSize] = useState(10);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [packets, setPackets] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);

  // This is the animation trigger for the streaming download
  useEffect(() => {
    if (isLoading && isStreaming) {
      const id = Math.random();
      setPackets(p => [...p, id]); // Add a new packet to the DOM
      
      // After the animation duration (1s), remove the packet
      const timer = setTimeout(() => {
        setPackets(p => p.filter(packetId => packetId !== id));
      }, 1000);

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [progress]); 

  const handleDownload = async (type) => {
    const startTime = Date.now();
    setIsLoading(true);
    setResult(null);
    setProgress(0);
    setProgressText("Initializing download...");
    setPackets([]);
    setIsStreaming(type === 'stream');

    const url = `http://localhost:8081/download-${type}/${fileSize}`;
    
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Server responded with status: ${response.status}`);
      
      const reader = response.body.getReader();
      const contentLength = response.headers.get('Content-Length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let receivedLength = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        receivedLength += value.length;
        setProgress(receivedLength); // Update progress with raw bytes received

        if (total > 0) {
          setProgressText(`${Math.round((receivedLength / total) * 100)}%`);
        } else {
          setProgressText(`${(receivedLength / (1024 * 1024)).toFixed(2)} MB Received`);
        }
      }

      const endTime = Date.now();
      const headers = {};
      for (const [key, value] of response.headers.entries()) headers[key] = value;
      
      setResult({ headers, time: (endTime - startTime) / 1000, size: receivedLength / (1024 * 1024), hasContentLength: !!contentLength });
    } catch (error) {
      console.error("Download failed:", error);
      setResult({ error: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const DataPacket = ({ id }) => <div className="packet" id={`packet-${id}`}></div>;

  return (
    <div className="App">
      <h1>HTTP Transfer Lab</h1>
      <p>An interactive demo comparing Content-Length vs. Transfer-Encoding: chunked.</p>

      <div className="visualization">
        <div className="box server">Server</div>
        <div className="pipe">
          {isLoading && isStreaming && packets.map(id => <DataPacket key={id} id={id} />)}
          {isLoading && !isStreaming && <div className="continuous-flow"></div>}
        </div>
        <div className="box client">Client</div>
      </div>
      
      <div className="controls">
        <h2>1. Configure Your Download</h2>
        <label>File Size: {fileSize} MB </label>
        <input type="range" min="1" max="200" value={fileSize} onChange={(e) => setFileSize(e.target.value)} disabled={isLoading} />
        <div>
          <button onClick={() => handleDownload('standard')} disabled={isLoading}>Run Standard Download</button>
          <button onClick={() => handleDownload('stream')} disabled={isLoading}>Run Streaming Download</button>
        </div>
      </div>

      {isLoading && (
        <div className="results">
          <h2>2. Download in Progress...</h2>
          <progress value={progress} max={result?.hasContentLength ? 100 : undefined}></progress>
          <p>{progressText}</p>
        </div>
      )}

      {result && !isLoading && (
        <div className="results">
          <h2>3. Results</h2>
          {result.error ? ( <pre style={{ color: 'red' }}>Error: {result.error}</pre> ) : (
            <>
              <p>Download complete in <strong>{result.time} seconds</strong>.</p>
              <p>Total data received: <strong>{result.size.toFixed(2)} MB</strong>.</p>
              <h3>Response Headers:</h3>
              <pre>{JSON.stringify(result.headers, null, 2)}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;