// Network Scanner JavaScript - UKH Cyber Tools

class NetworkScanner {
    constructor() {
        this.scanning = false;
        this.init();
    }

    init() {
        // Add event listeners if needed
    }

    startPortScan() {
        const target = document.getElementById('targetHost').value.trim();
        const portRange = document.getElementById('portRange').value.trim();

        if (!target || !portRange) {
            alert('Please enter target host and port range');
            return;
        }

        if (this.scanning) {
            alert('Scan already in progress');
            return;
        }

        this.scanning = true;
        document.getElementById('portScanProgress').style.display = 'block';
        document.getElementById('portResults').style.display = 'block';
        document.getElementById('portResults').innerHTML = '';
        document.getElementById('portScanStatus').textContent = 'Starting port scan...';
        document.getElementById('portScanBtn').disabled = true;

        const ports = this.parsePortRange(portRange);
        const totalPorts = ports.length;
        let scanned = 0;

        ports.forEach(port => {
            this.checkPort(target, port, (status, service) => {
                scanned++;
                this.updateProgress('portProgressFill', (scanned / totalPorts) * 100);
                this.addPortResult(port, status, service);
                
                if (scanned === totalPorts) {
                    this.completeScan();
                }
            });
        });
    }

    parsePortRange(range) {
        const ports = [];
        if (range.includes('-')) {
            const [start, end] = range.split('-').map(Number);
            for (let i = start; i <= end; i++) {
                ports.push(i);
            }
        } else if (range.includes(',')) {
            ports.push(...range.split(',').map(Number));
        } else {
            ports.push(Number(range));
        }
        return ports.filter(p => p >= 1 && p <= 65535);
    }

    checkPort(host, port, callback) {
        const timeout = 2000;
        const timer = setTimeout(() => {
            callback('closed');
        }, timeout);

        try {
            const ws = new WebSocket(`ws://${host}:${port}`);
            ws.onopen = () => {
                clearTimeout(timer);
                ws.close();
                callback('open', this.getCommonService(port));
            };
            ws.onerror = () => {
                clearTimeout(timer);
                callback('closed');
            };
        } catch (error) {
            clearTimeout(timer);
            callback('closed');
        }
    }

    getCommonService(port) {
        const services = {
            21: 'FTP',
            22: 'SSH',
            23: 'Telnet',
            25: 'SMTP',
            53: 'DNS',
            80: 'HTTP',
            110: 'POP3',
            143: 'IMAP',
            443: 'HTTPS',
            3306: 'MySQL',
            3389: 'RDP',
            5432: 'PostgreSQL',
            27017: 'MongoDB'
        };
        return services[port] || 'Unknown';
    }

    addPortResult(port, status, service) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-header">Port ${port}</div>
            <div>Status: <span class="port-${status}">${status.toUpperCase()}</span></div>
            <div>Service: ${service}</div>
        `;
        document.getElementById('portResults').appendChild(resultItem);
    }

    completeScan() {
        this.scanning = false;
        document.getElementById('portScanStatus').textContent = 'Scan completed';
        document.getElementById('portScanBtn').disabled = false;
    }

    startNetworkScan() {
        const range = document.getElementById('networkRange').value.trim();

        if (!range) {
            alert('Please enter network range');
            return;
        }

        if (this.scanning) {
            alert('Scan already in progress');
            return;
        }

        this.scanning = true;
        document.getElementById('networkScanProgress').style.display = 'block';
        document.getElementById('networkResults').style.display = 'block';
        document.getElementById('networkResults').innerHTML = '';
        document.getElementById('networkScanStatus').textContent = 'Starting network discovery...';
        document.getElementById('networkScanBtn').disabled = true;
        document.getElementById('networkMap').innerHTML = '';

        const ips = this.parseNetworkRange(range);
        const totalIPs = ips.length;
        let scanned = 0;
        let online = 0;

        ips.forEach(ip => {
            this.checkHost(ip, (status) => {
                scanned++;
                this.updateProgress('networkProgressFill', (scanned / totalIPs) * 100);
                this.addNetworkResult(ip, status);
                this.addToNetworkMap(ip, status);
                
                if (status === 'online') online++;

                if (scanned === totalIPs) {
                    this.completeNetworkScan(online, totalIPs);
                }
            });
        });
    }

    parseNetworkRange(range) {
        const ips = [];
        const [base, mask] = range.split('/');
        const baseIP = base.split('.').map(Number);
        const bits = parseInt(mask) || 24;
        const hostBits = 32 - bits;
        const numHosts = Math.pow(2, hostBits) - 2;  // Exclude network and broadcast

        // Simple generation for /24 or smaller
        if (bits >= 24) {
            const start = 1;  // Start from .1
            for (let i = start; i <= start + numHosts; i++) {
                ips.push(`${baseIP[0]}.${baseIP[1]}.${baseIP[2]}.${i}`);
            }
        } else {
            // For larger networks, limit to first 254 for performance
            for (let i = 1; i <= 254; i++) {
                ips.push(`${baseIP[0]}.${baseIP[1]}.${baseIP[2]}.${i}`);
            }
        }
        return ips;
    }

    checkHost(ip, callback) {
        const timeout = 1000;
        const img = new Image();
        const timer = setTimeout(() => {
            callback('offline');
        }, timeout);

        img.onload = img.onerror = () => {
            clearTimeout(timer);
            callback('online');
        };

        img.src = `http://${ip}/?${Date.now()}`;  // Cache bust
    }

    addNetworkResult(ip, status) {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.innerHTML = `
            <div class="result-header">${ip}</div>
            <div>Status: <span class="${status}">${status.toUpperCase()}</span></div>
        `;
        document.getElementById('networkResults').appendChild(resultItem);
    }

    addToNetworkMap(ip, status) {
        const hostCard = document.createElement('div');
        hostCard.className = `host-card ${status}`;
        hostCard.innerHTML = `
            <div class="host-ip">${ip}</div>
            <div class="host-status">${status.toUpperCase()}</div>
            <div class="host-ports">Click to scan ports</div>
        `;
        hostCard.onclick = () => {
            document.getElementById('targetHost').value = ip;
            this.startPortScan();
        };
        document.getElementById('networkMap').appendChild(hostCard);
    }

    completeNetworkScan(online, total) {
        this.scanning = false;
        document.getElementById('networkScanStatus').textContent = `Scan completed - ${online}/${total} hosts online`;
        document.getElementById('networkScanBtn').disabled = false;
    }

    updateProgress(elementId, percentage) {
        document.getElementById(elementId).style.width = `${percentage}%`;
    }

    setPortRange(range) {
        document.getElementById('portRange').value = range;
    }

    setNetworkRange(range) {
        document.getElementById('networkRange').value = range;
    }
}

// Global functions
function startPortScan() {
    networkScanner.startPortScan();
}

function startNetworkScan() {
    networkScanner.startNetworkScan();
}

function setPortRange(range) {
    networkScanner.setPortRange(range);
}

function setNetworkRange(range) {
    networkScanner.setNetworkRange(range);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.networkScanner = new NetworkScanner();
});
