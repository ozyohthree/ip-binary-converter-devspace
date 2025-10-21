import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [ipAddress, setIpAddress] = useState('');
  const [rawBinary, setRawBinary] = useState('');
  const [displayBinary, setDisplayBinary] = useState('');
  const [ipError, setIpError] = useState('');
  const [binaryError, setBinaryError] = useState('');

  const ipToBinary = (ip) => {
    return ip.split('.').map(octet => {
      const bin = parseInt(octet, 10).toString(2);
      return '00000000'.substring(bin.length) + bin;
    }).join('');
  };

  const binaryToIp = (bin) => {
    if (bin.length !== 32) {
      return 'Invalid binary length';
    }
    const octets = [];
    for (let i = 0; i < 4; i++) {
      const octetBin = bin.substring(i * 8, (i + 1) * 8);
      octets.push(parseInt(octetBin, 2));
    }
    return octets.join('.');
  };

  const formatBinary = (bin) => {
    return bin.match(/.{1,8}/g)?.join('.') || '';
  };

  const cleanBinary = (displayBin) => {
    return displayBin.replace(/\./g, '');
  };

  useEffect(() => {
    setDisplayBinary(formatBinary(rawBinary));
  }, [rawBinary]);

  const handleIpChange = (e) => {
    const value = e.target.value;
    setIpAddress(value);

    if (value === '') {
      setIpError('');
      setRawBinary('');
      setBinaryError('');
      return;
    }

    if (isValidIp(value)) {
      setIpError('');
      const newRawBinary = ipToBinary(value);
      setRawBinary(newRawBinary);
      setBinaryError('');
    } else {
      setIpError('Invalid IP Address format (e.g., 192.168.1.1)');
      setRawBinary('');
    }
  };

  const handleBinaryChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^01.]/g, '');

    const cleanedValue = cleanBinary(value);

    if (cleanedValue.length > 32) {
      return;
    }

    setRawBinary(cleanedValue);

    if (cleanedValue === '') {
      setBinaryError('');
      setIpAddress('');
      setIpError('');
      return;
    }

    if (isValidBinary(cleanedValue)) {
      setBinaryError('');
      setIpAddress(binaryToIp(cleanedValue));
      setIpError('');
    } else {
      setBinaryError('Binary must be exactly 32 bits (0s and 1s)');
      setIpAddress('');
    }
  };

  const isValidIp = (ip) => {
    if (ip === '') return true;
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
      const num = parseInt(part, 10);
      if (part.length > 1 && part[0] === '0') return false;
      return num >= 0 && num <= 255 && String(num) === part;
    });
  };

  const isValidBinary = (bin) => {
    if (bin === '') return true;
    return /^[01]{32}$/.test(bin);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>IP Address / Binary Converter</h1>
        <div className="converter-container">
          <div className="input-group">
            <label htmlFor="ip-address">IP Address:</label>
            <input
              id="ip-address"
              type="text"
              value={ipAddress}
              onChange={handleIpChange}
              placeholder="e.g., 192.168.1.1"
              className={ipError ? 'input-error' : ''}
            />
            {ipError && <p className="error-message">{ipError}</p>}
          </div>
          <div className="input-group">
            <label htmlFor="binary">Binary (32-bit):</label>
            <input
              id="binary"
              type="text"
              value={displayBinary}
              onChange={handleBinaryChange}
              placeholder="e.g., 11000000.10101000.00000001.00000001"
              className={binaryError ? 'input-error' : ''}
            />
            {binaryError && <p className="error-message">{binaryError}</p>}
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;