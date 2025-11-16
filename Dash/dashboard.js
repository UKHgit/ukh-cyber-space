// Dashboard JavaScript - UKH Cyber Command Center

class CyberDashboard {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('ukh_current_user'));
        this.threatLevel = 20; // 0-100
        this.charts = {};
        this.terminalHistory = [];
        this.scanningActive = false;
        this.networkData = {
            connections: 127,
            bandwidth: 45.2,
            blockedIPs: 23
        };
        this.securityData = {
            score: 98.7,
            threatsBlocked: 1247,
            uptime: 99.99,
            activeMonitors: 24
        };
        this.alerts = [];
        this.aiKnowledgeBase = {
            'analyze threats': 'Current threat analysis: Elevated activity detected in port 443 traffic. Recommendation: Enable deep packet inspection.',
            'recommendations': 'Security recommendations: 1) Update all systems to latest patches. 2) Implement multi-factor authentication. 3) Conduct regular penetration testing.',
            'health check': 'System health: All systems nominal. CPU: 23%, Memory: 45%, Disk: 67% used. No anomalies detected.',
            'security news': 'Latest news: New zero-day vulnerability in OpenSSL discovered. Update immediately. Ransomware attacks up 30% this quarter.'
        };
        
        this.init();
    }

    init() {
        this.checkAuthentication();
        this.initializeMatrixRain();
        this.initializeLoadingScreen();
        this.initializeNavigation();
        this.initializeRealTimeUpdates();
        this.initializeCharts();
        this.initializeTerminal();
        this.initializeAI();
        this.populateAlerts();
        this.startSystemMonitoring();
    }

    initializeMatrixRain() {
        const canvas = document.getElementById('matrix-rain');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationId;
        
        // Set canvas size with device pixel ratio for crisp rendering
        const resizeCanvas = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            
            ctx.scale(dpr, dpr);
            
            // Reinitialize drops after resize
            this.initializeMatrixDrops();
        };
        
        // Matrix characters (mix of Japanese katakana, numbers, and symbols)
        const matrixChars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+-=[]{}|;:,.<>?';
        const chars = matrixChars.split('');

        // Responsive font size
        const getFontSize = () => {
            return window.innerWidth < 768 ? 10 : 14;
        };

        let fontSize = getFontSize();
        let columns = Math.floor(window.innerWidth / fontSize);
        let drops = [];

        this.initializeMatrixDrops = () => {
            fontSize = getFontSize();
            columns = Math.floor(window.innerWidth / fontSize);
            drops = [];
            for (let i = 0; i < columns; i++) {
                drops[i] = Math.floor(Math.random() * window.innerHeight / fontSize);
            }
        };

        const drawMatrix = () => {
            // Semi-transparent black background for fade effect
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);

            ctx.fillStyle = '#00ff00';
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const char = chars[Math.floor(Math.random() * chars.length)];
                
                // Draw character
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);

                // Reset drop to top randomly or when it reaches bottom
                if (drops[i] * fontSize > window.innerHeight && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Move drop down
                drops[i]++;
            }

            animationId = requestAnimationFrame(drawMatrix);
        };

        // Initialize
        resizeCanvas();
        this.initializeMatrixDrops();
        
        // Handle resize
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                resizeCanvas();
            }, 100);
        });

        // Start the matrix rain animation
        drawMatrix();
    }

    startAnimations() {
        // Initialize any animations that need to start after dashboard loads
        this.initializeThreatMap();
    }

    populateAlerts() {
        // Initialize with some default alerts
        if (this.alerts.length === 0) {
            this.alerts = [
                {
                    level: 'low',
                    title: 'System Initialized',
                    description: 'UKH Cyber Dashboard successfully loaded',
                    time: 'Just now',
                    icon: 'fas fa-check-circle'
                },
                {
                    level: 'medium',
                    title: 'Security Scan Scheduled',
                    description: 'Automated security scan will run in 30 minutes',
                    time: '2 min ago',
                    icon: 'fas fa-clock'
                }
            ];
        }
        this.updateAlertList();
    }

    checkAuthentication() {
        if (!this.currentUser) {
            window.location.href = '../auth.html';
            return;
        }
        
        // Update user info in header
        const firstName = this.currentUser.name.split(' ')[0];
        const userNameDisplay = document.getElementById('user-name');
        const userNameHover = document.getElementById('user-name-hover');
        const userButton = document.getElementById('user-button');
        const userDropdown = document.getElementById('user-dropdown');
        
        if (userNameDisplay && userNameHover && userButton) {
            userNameDisplay.textContent = `\u00A0${firstName}\u00A0`;
            userNameHover.textContent = `\u00A0${firstName}\u00A0`;
            userButton.setAttribute('data-text', firstName);
            
            // Add click event to user button to toggle dropdown
            userButton.addEventListener('click', (e) => {
                e.stopPropagation();
                userDropdown.classList.toggle('show');
            });
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!userButton.contains(e.target) && !userDropdown.contains(e.target)) {
                    userDropdown.classList.remove('show');
                }
            });
        }
    }

    initializeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        const dashboard = document.getElementById('dashboard');
        const progressText = document.querySelector('.progress-text');
        
        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 20 + 10;
            if (progress > 100) progress = 100;
            
            if (progressText) {
                progressText.textContent = Math.floor(progress) + '%';
            }
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    if (loadingScreen) {
                        loadingScreen.style.opacity = '0';
                        setTimeout(() => {
                            loadingScreen.style.display = 'none';
                            if (dashboard) {
                                dashboard.classList.remove('dashboard-hidden');
                            }
                            this.startAnimations();
                        }, 300);
                    }
                }, 200);
            }
        }, 150);
    }

    initializeNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.content-section');

        navItems.forEach(item => {
            item.addEventListener('click', () => {
                const targetSection = item.dataset.section;
                
                // Update active nav item
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
                
                // Update active section
                sections.forEach(section => section.classList.remove('active'));
                document.getElementById(targetSection).classList.add('active');
                
                // Initialize section-specific features
                this.initializeSectionFeatures(targetSection);
            });
        });
    }

    initializeSectionFeatures(section) {
        switch(section) {
            case 'overview':
                this.initializeThreatMap();
                break;
            case 'security':
                this.initializeSecurityTools();
                break;
            case 'network':
                this.initializeNetworkTools();
                break;
            case 'tools':
                this.initializeCyberTools();
                break;
            case 'ai':
                this.initializeAIChat();
                break;
            case 'reports':
                this.initializeReports();
                break;
            case 'settings':
                this.initializeSettings();
                break;
        }
    }

    initializeRealTimeUpdates() {
        // Update system time every second
        this.updateSystemTime();
        setInterval(() => this.updateSystemTime(), 1000);
        
        // Update threat level every 5 seconds
        setInterval(() => this.updateThreatLevel(), 5000);
        
        // Update network stats every 3 seconds
        setInterval(() => this.updateNetworkStats(), 3000);
        
        // Update security stats every 2 seconds
        setInterval(() => this.updateSecurityStats(), 2000);
        
        // Add random alerts every 10-30 seconds
        setInterval(() => {
            if (Math.random() < 0.3) this.addRandomAlert();
        }, 10000);
    }

    updateSystemTime() {
        const now = new Date();
        const timeString = now.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
        document.getElementById('system-time').textContent = timeString;
    }

    updateThreatLevel() {
        // Simulate threat level fluctuation
        this.threatLevel += (Math.random() - 0.5) * 10;
        this.threatLevel = Math.max(0, Math.min(100, this.threatLevel));
        
        const indicator = document.getElementById('threat-indicator');
        const fill = document.getElementById('threat-fill');
        
        fill.style.width = this.threatLevel + '%';
        
        let levelText, color;
        if (this.threatLevel < 30) {
            levelText = 'SECURE';
            color = 'var(--success-color)';
        } else if (this.threatLevel < 70) {
            levelText = 'ELEVATED';
            color = 'var(--warning-color)';
        } else {
            levelText = 'CRITICAL';
            color = 'var(--danger-color)';
        }
        
        indicator.textContent = levelText;
        indicator.style.background = color;
        fill.style.background = color;
        
        // Update threat chart
        if (this.charts.threat) {
            const newData = Math.floor(this.threatLevel / 3.33);
            this.charts.threat.data.datasets[0].data.shift();
            this.charts.threat.data.datasets[0].data.push(newData);
            this.charts.threat.update('none');
        }
    }

    updateNetworkStats() {
        this.networkData.connections += Math.floor((Math.random() - 0.5) * 10);
        this.networkData.connections = Math.max(50, Math.min(200, this.networkData.connections));
        
        this.networkData.bandwidth += (Math.random() - 0.5) * 5;
        this.networkData.bandwidth = Math.max(20, Math.min(100, this.networkData.bandwidth));
        
        this.networkData.blockedIPs += Math.floor(Math.random() * 2);
        
        document.getElementById('network-connections').textContent = this.networkData.connections;
        document.getElementById('bandwidth-usage').textContent = this.networkData.bandwidth.toFixed(1) + ' MB/s';
        document.getElementById('blocked-ips').textContent = this.networkData.blockedIPs;
        
        // Update traffic chart
        if (this.charts.traffic) {
            const newData = [
                Math.floor(this.networkData.bandwidth * 0.45),
                Math.floor(this.networkData.bandwidth * 0.3),
                Math.floor(this.networkData.bandwidth * 0.2),
                Math.floor(this.networkData.bandwidth * 0.05)
            ];
            this.charts.traffic.data.datasets[0].data = newData;
            this.charts.traffic.update('none');
        }
    }

    updateSecurityStats() {
        this.securityData.score += (Math.random() - 0.5) * 0.5;
        this.securityData.score = Math.max(90, Math.min(99.9, this.securityData.score));
        
        if (Math.random() < 0.1) this.securityData.threatsBlocked += Math.floor(Math.random() * 5) + 1;
        
        this.securityData.uptime = 99.99 - (Math.random() * 0.01);
        
        this.securityData.activeMonitors += Math.floor((Math.random() - 0.5) * 2);
        this.securityData.activeMonitors = Math.max(20, Math.min(30, this.securityData.activeMonitors));
        
        document.getElementById('security-score').textContent = this.securityData.score.toFixed(1) + '%';
        document.getElementById('threats-blocked').textContent = this.securityData.threatsBlocked.toLocaleString();
        document.getElementById('system-uptime').textContent = this.securityData.uptime.toFixed(2) + '%';
        document.getElementById('active-monitors').textContent = this.securityData.activeMonitors;
    }

    initializeCharts() {
        this.initializeThreatChart();
        this.initializeTrafficChart();
    }

    initializeThreatChart() {
        const ctx = document.getElementById('threat-chart')?.getContext('2d');
        if (!ctx) return;

        const data = {
            labels: Array.from({length: 6}, (_, i) => `${i * 4}:00`),
            datasets: [{
                label: 'Threats Detected',
                data: Array.from({length: 6}, () => Math.floor(Math.random() * 30)),
                borderColor: '#00ff00',
                backgroundColor: 'rgba(0, 255, 0, 0.1)',
                tension: 0.4,
                fill: true,
                pointBackgroundColor: '#00ff00',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#00ff00'
            }]
        };

        this.charts.threat = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#ffffff' }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#00ff00',
                        bodyColor: '#ffffff'
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#b0b0b0' },
                        grid: { color: 'rgba(0, 255, 0, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#b0b0b0' },
                        grid: { color: 'rgba(0, 255, 0, 0.1)' },
                        beginAtZero: true
                    }
                },
                animation: {
                    duration: 1000,
                    easing: 'easeInOutQuad'
                }
            }
        });
    }

    initializeTrafficChart() {
        const ctx = document.getElementById('traffic-chart')?.getContext('2d');
        if (!ctx) return;

        const data = {
            labels: ['Inbound', 'Outbound', 'Internal', 'Blocked'],
            datasets: [{
                data: [45, 30, 20, 5],
                backgroundColor: [
                    'rgba(0, 255, 0, 0.6)',
                    'rgba(0, 128, 255, 0.6)',
                    'rgba(255, 128, 0, 0.6)',
                    'rgba(255, 0, 64, 0.6)'
                ],
                borderColor: '#ffffff',
                borderWidth: 2,
                hoverBackgroundColor: [
                    'rgba(0, 255, 0, 0.8)',
                    'rgba(0, 128, 255, 0.8)',
                    'rgba(255, 128, 0, 0.8)',
                    'rgba(255, 0, 64, 0.8)'
                ]
            }]
        };

        this.charts.traffic = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#ffffff',
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        titleColor: '#00ff00',
                        bodyColor: '#ffffff'
                    }
                },
                animation: {
                    animateRotate: true,
                    animateScale: true
                },
                cutout: '60%'
            }
        });
    }

    initializeTerminal() {
        const terminalInput = document.getElementById('terminal-command');
        const terminalOutput = document.getElementById('terminal-output');
        
        if (!terminalInput || !terminalOutput) return;

        // Add welcome message
        this.addTerminalOutput('UKH Cyber Command Terminal v2.1.0', 'system');
        this.addTerminalOutput('Type "help" for available commands', 'system');
        this.addTerminalOutput('');

        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const command = terminalInput.value.trim();
                if (command) {
                    this.executeTerminalCommand(command);
                    terminalInput.value = '';
                }
            }
        });

        // Add command history navigation
        terminalInput.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' && this.terminalHistory.length > 0) {
                terminalInput.value = this.terminalHistory[this.terminalHistory.length - 1];
            }
        });
    }

    addTerminalOutput(text, className = '') {
        const output = document.getElementById('terminal-output');
        if (!output) return;

        const line = document.createElement('div');
        line.textContent = text;
        line.className = `terminal-line ${className}`;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    }

    executeTerminalCommand(command) {
        this.terminalHistory.push(command);
        this.addTerminalOutput(`root@ukh-cyber:~$ ${command}`, 'command');
        
        const parts = command.toLowerCase().split(' ');
        const cmd = parts[0];
        const args = parts.slice(1);
        
        switch(cmd) {
            case 'help':
                this.addTerminalOutput('Available commands:', 'system');
                this.addTerminalOutput('  help     - Show this help message');
                this.addTerminalOutput('  status   - Show system status');
                this.addTerminalOutput('  scan [type] - Start scan (types: malware, network, ports)');
                this.addTerminalOutput('  threats  - Show recent threats');
                this.addTerminalOutput('  clear    - Clear terminal');
                this.addTerminalOutput('  nmap <target> - Scan target ports');
                this.addTerminalOutput('  ping <host> - Ping a host');
                this.addTerminalOutput('  trace <host> - Trace route to host');
                this.addTerminalOutput('  whois <domain> - Get domain info');
                break;
                
            case 'status':
                this.addTerminalOutput('System Status:', 'system');
                this.addTerminalOutput(`Threat Level: ${this.threatLevel.toFixed(1)}%`);
                this.addTerminalOutput(`Security Score: ${this.securityData.score.toFixed(1)}%`);
                this.addTerminalOutput(`Active Monitors: ${this.securityData.activeMonitors}`);
                this.addTerminalOutput(`Uptime: ${this.securityData.uptime.toFixed(2)}%`);
                break;
                
            case 'scan':
                const type = args[0] || 'full';
                this.addTerminalOutput(`Initiating ${type} scan...`, 'system');
                this.simulateScan(type);
                break;
                
            case 'threats':
                this.addTerminalOutput('Recent Threats:', 'system');
                this.alerts.slice(-5).forEach(alert => {
                    this.addTerminalOutput(`[${alert.level.toUpperCase()}] ${alert.title}: ${alert.description}`, alert.level);
                });
                break;
                
            case 'clear':
                document.getElementById('terminal-output').innerHTML = '';
                break;
                
            case 'nmap':
                if (!args[0]) {
                    this.addTerminalOutput('Usage: nmap <target>', 'error');
                    return;
                }
                this.addTerminalOutput(`Starting Nmap scan on ${args[0]}...`, 'system');
                this.simulateNmap(args[0]);
                break;
                
            case 'ping':
                if (!args[0]) {
                    this.addTerminalOutput('Usage: ping <host>', 'error');
                    return;
                }
                this.addTerminalOutput(`PING ${args[0]}:`, 'system');
                this.simulatePing(args[0]);
                break;
                
            case 'trace':
                if (!args[0]) {
                    this.addTerminalOutput('Usage: trace <host>', 'error');
                    return;
                }
                this.addTerminalOutput(`Tracing route to ${args[0]}:`, 'system');
                this.simulateTraceroute(args[0]);
                break;
                
            case 'whois':
                if (!args[0]) {
                    this.addTerminalOutput('Usage: whois <domain>', 'error');
                    return;
                }
                this.addTerminalOutput(`Performing WHOIS lookup for ${args[0]}...`, 'system');
                this.simulateWhois(args[0]);
                break;
                
            default:
                this.addTerminalOutput(`Command not found: ${command}`, 'error');
                this.addTerminalOutput('Type "help" for available commands', 'system');
        }
        
        this.addTerminalOutput('');
    }

    simulateScan(type) {
        const steps = {
            malware: [
                'Initializing malware signatures...',
                'Scanning system files...',
                'Checking running processes...',
                'Analyzing network connections...',
                'Scan completed - 0 threats found'
            ],
            network: [
                'Discovering network hosts...',
                'Mapping topology...',
                'Checking for rogue devices...',
                'Analyzing traffic patterns...',
                'Network scan completed'
            ],
            ports: [
                'Probing common ports...',
                'Checking for open services...',
                'Detecting vulnerabilities...',
                'Port scan completed'
            ],
            full: [
                'Starting full system scan...',
                'Phase 1: Malware detection',
                'Phase 2: Network analysis',
                'Phase 3: Vulnerability assessment',
                'Full scan completed'
            ]
        };

        const scanSteps = steps[type] || steps.full;
        scanSteps.forEach((step, index) => {
            setTimeout(() => {
                this.addTerminalOutput(step, 'scan');
            }, index * 1000);
        });
    }

    simulateNmap(target) {
        setTimeout(() => {
            this.addTerminalOutput('Host is up (0.024s latency).', 'scan');
            this.addTerminalOutput('Not shown: 997 closed ports', 'scan');
            this.addTerminalOutput('PORT     STATE SERVICE', 'scan');
            this.addTerminalOutput('22/tcp   open  ssh', 'open');
            this.addTerminalOutput('80/tcp   open  http', 'open');
            this.addTerminalOutput('443/tcp  open  https', 'open');
            this.addTerminalOutput('Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds', 'system');
        }, 2000);
    }

    simulatePing(host) {
        const pings = 4;
        for (let i = 0; i < pings; i++) {
            setTimeout(() => {
                const time = (Math.random() * 50 + 10).toFixed(0);
                const ttl = Math.floor(Math.random() * 10) + 55;
                this.addTerminalOutput(`64 bytes from ${host}: icmp_seq=${i+1} ttl=${ttl} time=${time} ms`, 'scan');
            }, i * 500);
        }
        setTimeout(() => {
            this.addTerminalOutput(`\n--- ${host} ping statistics ---`, 'system');
            this.addTerminalOutput(`${pings} packets transmitted, ${pings} received, 0% packet loss`, 'system');
        }, pings * 500);
    }

    simulateTraceroute(host) {
        const hops = Math.floor(Math.random() * 5) + 5;
        for (let i = 1; i <= hops; i++) {
            setTimeout(() => {
                const time1 = (Math.random() * 20 + 5).toFixed(2);
                const time2 = (Math.random() * 20 + 5).toFixed(2);
                const time3 = (Math.random() * 20 + 5).toFixed(2);
                const ip = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                this.addTerminalOutput(`${i}  ${ip}  ${time1} ms  ${time2} ms  ${time3} ms`, 'scan');
            }, i * 300);
        }
        setTimeout(() => {
            this.addTerminalOutput(`Trace complete.`, 'system');
        }, hops * 300);
    }

    simulateWhois(domain) {
        setTimeout(() => {
            this.addTerminalOutput(`Domain Name: ${domain.toUpperCase()}`, 'scan');
            this.addTerminalOutput(`Registry Domain ID: 123456789_DOMAIN_COM-VRSN`, 'scan');
            this.addTerminalOutput(`Registrar WHOIS Server: whois.example.com`, 'scan');
            this.addTerminalOutput(`Registrar URL: http://www.example.com`, 'scan');
            this.addTerminalOutput(`Updated Date: 2023-01-01T00:00:00Z`, 'scan');
            this.addTerminalOutput(`Creation Date: 2000-01-01T00:00:00Z`, 'scan');
            this.addTerminalOutput(`Registry Expiry Date: 2025-01-01T00:00:00Z`, 'scan');
            this.addTerminalOutput(`Name Server: NS1.EXAMPLE.COM`, 'scan');
            this.addTerminalOutput(`Name Server: NS2.EXAMPLE.COM`, 'scan');
        }, 1500);
    }

    addRandomAlert() {
        const levels = ['low', 'medium', 'high'];
        const titles = [
            'Suspicious Login Attempt',
            'Port Scan Detected',
            'Malware Signature Match',
            'DDoS Mitigation Activated',
            'Vulnerability Detected',
            'System Update Available'
        ];
        const descriptions = [
            'Multiple failed attempts from unknown IP',
            'Scanning activity from external source',
            'Potential malware detected in file scan',
            'High traffic volume - auto-mitigated',
            'Known vulnerability in software version',
            'Security patch available for download'
        ];

        const randomIndex = Math.floor(Math.random() * titles.length);
        const level = levels[Math.floor(Math.random() * levels.length)];

        const alert = {
            level,
            title: titles[randomIndex],
            description: descriptions[randomIndex],
            time: 'Just now',
            icon: level === 'high' ? 'fas fa-exclamation-triangle' : 'fas fa-bell'
        };

        this.alerts.push(alert);
        this.updateAlertList();
        
        // Add to terminal
        this.addTerminalOutput(`[ALERT] ${alert.title}: ${alert.description}`, alert.level);
    }

    updateAlertList() {
        const alertList = document.getElementById('alert-list');
        if (!alertList) return;

        alertList.innerHTML = '';
        this.alerts.slice(-5).reverse().forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = 'alert-item';
            alertElement.innerHTML = `
                <div class="alert-icon ${alert.level}">
                    <i class="${alert.icon}"></i>
                </div>
                <div class="alert-content">
                    <div class="alert-title">${alert.title}</div>
                    <div class="alert-description">${alert.description}</div>
                </div>
                <div class="alert-time">${alert.time}</div>
            `;
            alertList.appendChild(alertElement);
        });
    }

    initializeThreatMap() {
        const threatPoints = document.querySelectorAll('.threat-point');
        threatPoints.forEach(point => {
            point.addEventListener('click', () => {
                alert(point.dataset.threat);
            });
            // Animate
            point.style.animation = `pulse ${1 + Math.random()}s infinite`;
        });

        // Add random threats periodically
        setInterval(() => {
            if (Math.random() < 0.2) {
                const map = document.querySelector('.map-container');
                const newPoint = document.createElement('div');
                newPoint.className = 'threat-point';
                newPoint.style.top = Math.random() * 100 + '%';
                newPoint.style.left = Math.random() * 100 + '%';
                newPoint.dataset.threat = 'New Threat Detected';
                newPoint.style.animation = 'pulse 1s infinite';
                map.appendChild(newPoint);
                
                setTimeout(() => newPoint.remove(), 10000);
            }
        }, 5000);
    }

    initializeSecurityTools() {
        const firewallToggle = document.getElementById('firewall-toggle');
        if (firewallToggle) {
            firewallToggle.addEventListener('change', (e) => {
                const status = e.target.checked ? 'ENABLED' : 'DISABLED';
                this.addTerminalOutput(`Firewall ${status}`, 'system');
                // Simulate effect on blocked IPs
                if (!e.target.checked) {
                    this.networkData.blockedIPs = 0;
                }
            });
        }
    }

    initializeNetworkTools() {
        const targetIp = document.getElementById('target-ip');
        if (targetIp) {
            targetIp.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.scanPorts();
                }
            });
        }
    }

    initializeCyberTools() {
        const toolCards = document.querySelectorAll('.tool-card');
        toolCards.forEach(card => {
            card.addEventListener('click', () => {
                const toolName = card.dataset.tool;
                this.openTool(toolName);
            });
        });
    }

    initializeAIChat() {
        const aiInput = document.getElementById('ai-input');
        if (aiInput) {
            aiInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendAIMessage();
                }
            });
            aiInput.focus();
        }
    }

    initializeReports() {
        // Add download functionality
        const generateBtn = document.querySelector('.generate-report-btn');
        if (generateBtn) {
            generateBtn.addEventListener('click', () => this.generateReport());
        }
    }

    initializeSettings() {
        const themeSelect = document.getElementById('theme-select');
        themeSelect.addEventListener('change', (e) => {
            document.body.className = e.target.value;
            localStorage.setItem('dashboard-theme', e.target.value);
        });

        // Load saved theme
        const savedTheme = localStorage.getItem('dashboard-theme');
        if (savedTheme) {
            themeSelect.value = savedTheme;
            document.body.className = savedTheme;
        }

        const animationSpeed = document.getElementById('animation-speed');
        animationSpeed.addEventListener('input', (e) => {
            document.documentElement.style.setProperty('--animation-speed', e.target.value);
            localStorage.setItem('animation-speed', e.target.value);
        });

        // Load saved speed
        const savedSpeed = localStorage.getItem('animation-speed');
        if (savedSpeed) {
            animationSpeed.value = savedSpeed;
            document.documentElement.style.setProperty('--animation-speed', savedSpeed);
        }

        // Notification toggles
        const toggles = document.querySelectorAll('#settings .toggle-switch input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => {
                const id = e.target.id;
                localStorage.setItem(id, e.target.checked);
            });

            // Load saved state
            const saved = localStorage.getItem(toggle.id);
            if (saved !== null) {
                toggle.checked = saved === 'true';
            }
        });
    }

    startSystemMonitoring() {
        setInterval(() => {
            this.updateSystemMetrics();
        }, 1000);
    }

    updateSystemMetrics() {
        this.updateThreatLevel();
        this.updateNetworkStats();
        this.updateSecurityStats();
    }

    refreshData() {
        this.updateSystemMetrics();
        this.populateAlerts();
        this.addTerminalOutput('Dashboard data refreshed', 'system');
    }

    generateReport() {
        const reportContent = `
UKH Cyber Dashboard Report
Generated: ${new Date().toLocaleString()}

Security Score: ${this.securityData.score.toFixed(1)}%
Threats Blocked: ${this.securityData.threatsBlocked}
System Uptime: ${this.securityData.uptime.toFixed(2)}%
Active Monitors: ${this.securityData.activeMonitors}
Threat Level: ${this.threatLevel.toFixed(1)}%

Recent Alerts:
${this.alerts.slice(-5).map(a => `[${a.level}] ${a.title}: ${a.description}`).join('\n')}

Network Stats:
Connections: ${this.networkData.connections}
Bandwidth: ${this.networkData.bandwidth.toFixed(1)} MB/s
Blocked IPs: ${this.networkData.blockedIPs}
        `;

        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cyber-report-${new Date().toISOString().split('T')[0]}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        this.addTerminalOutput('Report generated and downloaded', 'system');
    }

    startScan(type) {
        const progressElement = document.getElementById(`${type}-progress`);
        if (!progressElement) return;

        const progressBar = progressElement.querySelector('.progress-fill');
        const statusElement = progressElement.querySelector('.scan-status');
        
        if (this.scanningActive) {
            statusElement.textContent = 'Scan already in progress...';
            return;
        }

        this.scanningActive = true;
        statusElement.textContent = 'Initializing scan...';
        progressBar.style.width = '0%';

        let progress = 0;
        const scanInterval = setInterval(() => {
            progress += Math.random() * 10 + 5;
            if (progress > 100) progress = 100;

            progressBar.style.width = progress + '%';
            
            if (progress < 30) {
                statusElement.textContent = 'Scanning system files...';
            } else if (progress < 60) {
                statusElement.textContent = 'Analyzing network traffic...';
            } else if (progress < 90) {
                statusElement.textContent = 'Checking for vulnerabilities...';
            } else {
                statusElement.textContent = 'Finalizing scan results...';
            }

            if (progress >= 100) {
                clearInterval(scanInterval);
                const threatsFound = Math.floor(Math.random() * 5);
                statusElement.textContent = `Scan completed - ${threatsFound} threats detected`;
                this.scanningActive = false;
                
                // Add to terminal
                this.addTerminalOutput(`${type} scan completed: ${threatsFound} threats found`, 'scan');
                
                // Update stats
                this.securityData.threatsBlocked += threatsFound;
                this.updateSecurityStats();
                
                // Add alert if threats found
                if (threatsFound > 0) {
                    this.addRandomAlert();
                }
            }
        }, 300);
    }

    scanPorts() {
        const target = document.getElementById('target-ip').value.trim();
        if (!target) {
            alert('Please enter a target IP or hostname');
            return;
        }

        this.addTerminalOutput(`Starting port scan on ${target}...`, 'system');

        // Simulate port scan
        setTimeout(() => {
            const ports = [22, 80, 443, 3389, 8080];
            ports.forEach((port, index) => {
                setTimeout(() => {
                    const status = Math.random() < 0.7 ? 'open' : 'closed';
                    this.addTerminalOutput(`Port ${port}/tcp ${status}`, status === 'open' ? 'open' : 'closed');
                }, index * 500);
            });
            setTimeout(() => {
                this.addTerminalOutput('Port scan completed', 'system');
            }, ports.length * 500);
        }, 1000);
    }

    openTool(toolName) {
        const modal = document.getElementById('tool-modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        
        if (!modal || !modalTitle || !modalBody) return;
        
        modalTitle.textContent = this.getToolTitle(toolName);
        modalBody.innerHTML = this.getToolContent(toolName);
        modal.style.display = 'block';
        
        // Initialize tool-specific functionality
        this.initializeToolFunctionality(toolName);
    }
    
    getToolTitle(toolName) {
        const titles = {
            'password-manager': 'Password Manager',
            'crypto-tool': 'Crypto & Hash Tool',
            'network-scanner': 'Network Scanner',
            'vulnerability-scanner': 'Vulnerability Scanner',
            'ip-tracker': 'IP Geolocation Tracker',
            'forensics-tool': 'Digital Forensics Tool'
        };
        return titles[toolName] || 'Cyber Tool';
    }
    
    getToolContent(toolName) {
        switch(toolName) {
            case 'password-manager':
                return `
                    <div class="tool-container">
                        <div class="tool-section">
                            <h4>Password Generator</h4>
                            <div class="input-group">
                                <label>Length:</label>
                                <input type="range" id="pwd-length" min="8" max="64" value="16">
                                <span id="pwd-length-display">16</span>
                            </div>
                            <div class="checkbox-group">
                                <label><input type="checkbox" id="pwd-uppercase" checked> Uppercase</label>
                                <label><input type="checkbox" id="pwd-lowercase" checked> Lowercase</label>
                                <label><input type="checkbox" id="pwd-numbers" checked> Numbers</label>
                                <label><input type="checkbox" id="pwd-symbols" checked> Symbols</label>
                            </div>
                            <button class="tool-btn" onclick="generatePassword()">Generate Password</button>
                            <div class="output-field">
                                <input type="text" id="generated-password" readonly placeholder="Generated password will appear here">
                                <button onclick="copyToClipboard('generated-password')">Copy</button>
                            </div>
                        </div>
                        <div class="tool-section">
                            <h4>Password Strength Checker</h4>
                            <input type="password" id="password-check" placeholder="Enter password to check strength">
                            <div id="password-strength" class="strength-meter"></div>
                            <div id="strength-feedback"></div>
                        </div>
                    </div>
                `;
            
            case 'crypto-tool':
                return `
                    <div class="tool-container">
                        <div class="tool-section">
                            <h4>Hash Generator</h4>
                            <textarea id="hash-input" placeholder="Enter text to hash"></textarea>
                            <select id="hash-algorithm">
                                <option value="md5">MD5</option>
                                <option value="sha1">SHA-1</option>
                                <option value="sha256">SHA-256</option>
                                <option value="sha512">SHA-512</option>
                            </select>
                            <button class="tool-btn" onclick="generateHash()">Generate Hash</button>
                            <div class="output-field">
                                <input type="text" id="hash-output" readonly placeholder="Hash will appear here">
                                <button onclick="copyToClipboard('hash-output')">Copy</button>
                            </div>
                        </div>
                        <div class="tool-section">
                            <h4>Base64 Encoder/Decoder</h4>
                            <textarea id="base64-input" placeholder="Enter text to encode/decode"></textarea>
                            <div class="button-group">
                                <button class="tool-btn" onclick="encodeBase64()">Encode</button>
                                <button class="tool-btn" onclick="decodeBase64()">Decode</button>
                            </div>
                            <textarea id="base64-output" readonly placeholder="Result will appear here"></textarea>
                        </div>
                    </div>
                `;
            
            case 'network-scanner':
                return `
                    <div class="tool-container">
                        <div class="tool-section">
                            <h4>Port Scanner</h4>
                            <div class="input-group">
                                <input type="text" id="scan-target" placeholder="Enter IP or hostname">
                                <input type="text" id="port-range" placeholder="Port range (e.g., 1-1000)" value="1-1000">
                            </div>
                            <button class="tool-btn" onclick="startPortScan()">Start Scan</button>
                            <div id="scan-progress" class="progress-container" style="display: none;">
                                <div class="progress-bar"><div class="progress-fill"></div></div>
                                <div class="progress-text">Scanning...</div>
                            </div>
                            <div id="scan-results" class="results-container"></div>
                        </div>
                        <div class="tool-section">
                            <h4>Network Discovery</h4>
                            <input type="text" id="network-range" placeholder="Network range (e.g., 192.168.1.0/24)">
                            <button class="tool-btn" onclick="discoverNetwork()">Discover Hosts</button>
                            <div id="discovery-results" class="results-container"></div>
                        </div>
                    </div>
                `;
            
            case 'ip-tracker':
                return `
                    <div class="tool-container">
                        <div class="tool-section">
                            <h4>IP Geolocation</h4>
                            <input type="text" id="ip-address" placeholder="Enter IP address">
                            <button class="tool-btn" onclick="trackIP()">Track IP</button>
                            <div id="ip-results" class="results-container"></div>
                        </div>
                        <div class="tool-section">
                            <h4>My IP Information</h4>
                            <button class="tool-btn" onclick="getMyIP()">Get My IP Info</button>
                            <div id="my-ip-results" class="results-container"></div>
                        </div>
                    </div>
                `;
            
            case 'vulnerability-scanner':
                return `
                    <div class="tool-container">
                        <div class="tool-section">
                            <h4>Web Vulnerability Scanner</h4>
                            <input type="url" id="vuln-target" placeholder="Enter website URL">
                            <div class="checkbox-group">
                                <label><input type="checkbox" id="check-ssl" checked> SSL/TLS Check</label>
                                <label><input type="checkbox" id="check-headers" checked> Security Headers</label>
                                <label><input type="checkbox" id="check-ports" checked> Open Ports</label>
                                <label><input type="checkbox" id="check-xss" checked> XSS Vulnerabilities</label>
                            </div>
                            <button class="tool-btn" onclick="startVulnScan()">Start Vulnerability Scan</button>
                            <div id="vuln-progress" class="progress-container" style="display: none;">
                                <div class="progress-bar"><div class="progress-fill"></div></div>
                                <div class="progress-text">Scanning for vulnerabilities...</div>
                            </div>
                            <div id="vuln-results" class="results-container"></div>
                        </div>
                    </div>
                `;
            
            case 'forensics-tool':
                return `
                    <div class="tool-container">
                        <div class="tool-section">
                            <h4>File Hash Analyzer</h4>
                            <input type="file" id="forensic-file" accept="*/*">
                            <button class="tool-btn" onclick="analyzeFile()">Analyze File</button>
                            <div id="file-analysis" class="results-container"></div>
                        </div>
                        <div class="tool-section">
                            <h4>Metadata Extractor</h4>
                            <input type="file" id="metadata-file" accept="image/*,video/*,audio/*">
                            <button class="tool-btn" onclick="extractMetadata()">Extract Metadata</button>
                            <div id="metadata-results" class="results-container"></div>
                        </div>
                    </div>
                `;
            
            default:
                return '<p>Tool functionality coming soon...</p>';
        }
    }
    
    initializeToolFunctionality(toolName) {
        switch(toolName) {
            case 'password-manager':
                this.initPasswordManager();
                break;
            case 'crypto-tool':
                this.initCryptoTool();
                break;
            case 'network-scanner':
                this.initNetworkScanner();
                break;
            case 'ip-tracker':
                this.initIPTracker();
                break;
            case 'vulnerability-scanner':
                this.initVulnScanner();
                break;
            case 'forensics-tool':
                this.initForensicsTool();
                break;
        }
    }
    
    initPasswordManager() {
        const lengthSlider = document.getElementById('pwd-length');
        const lengthDisplay = document.getElementById('pwd-length-display');
        const passwordCheck = document.getElementById('password-check');
        
        if (lengthSlider && lengthDisplay) {
            lengthSlider.addEventListener('input', (e) => {
                lengthDisplay.textContent = e.target.value;
            });
        }
        
        if (passwordCheck) {
            passwordCheck.addEventListener('input', (e) => {
                this.checkPasswordStrength(e.target.value);
            });
        }
    }
    
    initCryptoTool() {
        // Crypto tool is ready to use with the functions defined below
    }
    
    initNetworkScanner() {
        // Network scanner is ready to use with the functions defined below
    }
    
    initIPTracker() {
        // IP tracker is ready to use with the functions defined below
    }
    
    initVulnScanner() {
        // Vulnerability scanner is ready to use with the functions defined below
    }
    
    initForensicsTool() {
        // Forensics tool is ready to use with the functions defined below
    }
    
    checkPasswordStrength(password) {
        const strengthMeter = document.getElementById('password-strength');
        const feedback = document.getElementById('strength-feedback');
        
        if (!strengthMeter || !feedback) return;
        
        let score = 0;
        let feedback_text = [];
        
        // Length check
        if (password.length >= 8) score += 1;
        else feedback_text.push('Use at least 8 characters');
        
        if (password.length >= 12) score += 1;
        
        // Character variety
        if (/[a-z]/.test(password)) score += 1;
        else feedback_text.push('Add lowercase letters');
        
        if (/[A-Z]/.test(password)) score += 1;
        else feedback_text.push('Add uppercase letters');
        
        if (/[0-9]/.test(password)) score += 1;
        else feedback_text.push('Add numbers');
        
        if (/[^A-Za-z0-9]/.test(password)) score += 1;
        else feedback_text.push('Add special characters');
        
        // Update strength meter
        const strength = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
        const colors = ['#ff0000', '#ff4500', '#ffa500', '#ffff00', '#9acd32', '#00ff00'];
        
        strengthMeter.style.width = (score / 6) * 100 + '%';
        strengthMeter.style.backgroundColor = colors[score] || colors[0];
        
        feedback.innerHTML = `
            <div class="strength-label">${strength[score] || 'Very Weak'}</div>
            ${feedback_text.length > 0 ? '<div class="strength-tips">' + feedback_text.join(', ') + '</div>' : ''}
        `;
    }

    sendAIMessage() {
        const input = document.getElementById('ai-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        this.addAIMessage(message, 'user');
        input.value = '';
        
        // Generate response
        setTimeout(() => {
            const response = this.generateAIResponse(message);
            this.addAIMessage(response, 'ai');
        }, 800 + Math.random() * 400);
    }

    addAIMessage(message, sender) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `message ${sender}-message`;
        
        const avatar = sender === 'ai' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
        
        messageElement.innerHTML = `
            <div class="message-avatar">${avatar}</div>
            <div class="message-content">
                <p>${message}</p>
                <span class="message-time">${time}</span>
            </div>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    generateAIResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        for (const [key, response] of Object.entries(this.aiKnowledgeBase)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        // Default responses
        const defaults = [
            'Processing your query... Based on current data, everything looks secure.',
            'I\'m analyzing that. No immediate threats detected.',
            'Command acknowledged. Running diagnostics...',
            'Affirmative. Security protocols are active.'
        ];
        return defaults[Math.floor(Math.random() * defaults.length)];
    }

    askAI(question) {
        document.getElementById('ai-input').value = question;
        this.sendAIMessage();
    }
}

// Global functions
function logout() {
    if (confirm('Confirm logout?')) {
        localStorage.removeItem('ukh_current_user');
        window.location.href = '../auth.html';
    }
}

function refreshData() {
    dashboard.refreshData();
}

function startScan(type) {
    dashboard.startScan(type);
}

function scanPorts() {
    dashboard.scanPorts();
}

function sendAIMessage() {
    dashboard.sendAIMessage();
}

function askAI(question) {
    dashboard.askAI(question);
}

function generateReport() {
    dashboard.generateReport();
}

// Tool Functions
function generatePassword() {
    const length = parseInt(document.getElementById('pwd-length').value);
    const uppercase = document.getElementById('pwd-uppercase').checked;
    const lowercase = document.getElementById('pwd-lowercase').checked;
    const numbers = document.getElementById('pwd-numbers').checked;
    const symbols = document.getElementById('pwd-symbols').checked;
    
    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) {
        alert('Please select at least one character type');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    document.getElementById('generated-password').value = password;
}

function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    
    // Show feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = 'Copied!';
    setTimeout(() => {
        button.textContent = originalText;
    }, 2000);
}

async function generateHash() {
    const input = document.getElementById('hash-input').value;
    const algorithm = document.getElementById('hash-algorithm').value;
    
    if (!input) {
        alert('Please enter text to hash');
        return;
    }
    
    // Simple hash simulation (in real implementation, use crypto libraries)
    let hash = '';
    switch(algorithm) {
        case 'md5':
            hash = btoa(input).substring(0, 32);
            break;
        case 'sha1':
            hash = btoa(input + 'sha1').substring(0, 40);
            break;
        case 'sha256':
            hash = btoa(input + 'sha256').substring(0, 64);
            break;
        case 'sha512':
            hash = btoa(input + 'sha512').substring(0, 128);
            break;
    }
    
    document.getElementById('hash-output').value = hash;
}

function encodeBase64() {
    const input = document.getElementById('base64-input').value;
    if (!input) {
        alert('Please enter text to encode');
        return;
    }
    
    try {
        const encoded = btoa(input);
        document.getElementById('base64-output').value = encoded;
    } catch (error) {
        alert('Error encoding text');
    }
}

function decodeBase64() {
    const input = document.getElementById('base64-input').value;
    if (!input) {
        alert('Please enter text to decode');
        return;
    }
    
    try {
        const decoded = atob(input);
        document.getElementById('base64-output').value = decoded;
    } catch (error) {
        alert('Invalid Base64 input');
    }
}

function startPortScan() {
    const target = document.getElementById('scan-target').value.trim();
    const portRange = document.getElementById('port-range').value.trim();
    
    if (!target) {
        alert('Please enter a target IP or hostname');
        return;
    }
    
    const progressContainer = document.getElementById('scan-progress');
    const resultsContainer = document.getElementById('scan-results');
    const progressFill = progressContainer.querySelector('.progress-fill');
    const progressText = progressContainer.querySelector('.progress-text');
    
    progressContainer.style.display = 'block';
    resultsContainer.innerHTML = '';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `Scanning ${target}... ${Math.floor(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            progressContainer.style.display = 'none';
            
            // Simulate scan results
            const ports = [22, 80, 443, 8080, 3389, 21, 25, 53, 110, 993];
            let results = '<h5>Scan Results:</h5>';
            
            ports.forEach(port => {
                const isOpen = Math.random() < 0.3;
                const status = isOpen ? 'OPEN' : 'CLOSED';
                const statusClass = isOpen ? 'open' : 'closed';
                results += `<div class="scan-result ${statusClass}">Port ${port}/tcp: ${status}</div>`;
            });
            
            resultsContainer.innerHTML = results;
        }
    }, 200);
}

function discoverNetwork() {
    const networkRange = document.getElementById('network-range').value.trim();
    const resultsContainer = document.getElementById('discovery-results');
    
    if (!networkRange) {
        alert('Please enter a network range');
        return;
    }
    
    resultsContainer.innerHTML = '<div class="scanning">Discovering hosts...</div>';
    
    setTimeout(() => {
        let results = '<h5>Discovered Hosts:</h5>';
        const baseIP = networkRange.split('/')[0].split('.').slice(0, 3).join('.');
        
        for (let i = 1; i <= 10; i++) {
            const ip = `${baseIP}.${Math.floor(Math.random() * 254) + 1}`;
            const hostname = `host-${i}.local`;
            const mac = Array.from({length: 6}, () => Math.floor(Math.random() * 256).toString(16).padStart(2, '0')).join(':');
            
            results += `
                <div class="host-result">
                    <div><strong>IP:</strong> ${ip}</div>
                    <div><strong>Hostname:</strong> ${hostname}</div>
                    <div><strong>MAC:</strong> ${mac}</div>
                </div>
            `;
        }
        
        resultsContainer.innerHTML = results;
    }, 2000);
}

function trackIP() {
    const ip = document.getElementById('ip-address').value.trim();
    const resultsContainer = document.getElementById('ip-results');
    
    if (!ip) {
        alert('Please enter an IP address');
        return;
    }
    
    resultsContainer.innerHTML = '<div class="scanning">Tracking IP...</div>';
    
    setTimeout(() => {
        const mockData = {
            ip: ip,
            country: 'United States',
            region: 'California',
            city: 'San Francisco',
            isp: 'Example ISP',
            org: 'Example Organization',
            timezone: 'America/Los_Angeles',
            lat: '37.7749',
            lon: '-122.4194'
        };
        
        let results = '<h5>IP Information:</h5>';
        Object.entries(mockData).forEach(([key, value]) => {
            results += `<div class="ip-info"><strong>${key.toUpperCase()}:</strong> ${value}</div>`;
        });
        
        resultsContainer.innerHTML = results;
    }, 1500);
}

function getMyIP() {
    const resultsContainer = document.getElementById('my-ip-results');
    resultsContainer.innerHTML = '<div class="scanning">Getting your IP information...</div>';
    
    // Simulate getting user's IP info
    setTimeout(() => {
        const mockData = {
            ip: '203.0.113.1',
            country: 'Your Country',
            region: 'Your Region',
            city: 'Your City',
            isp: 'Your ISP',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        };
        
        let results = '<h5>Your IP Information:</h5>';
        Object.entries(mockData).forEach(([key, value]) => {
            results += `<div class="ip-info"><strong>${key.toUpperCase()}:</strong> ${value}</div>`;
        });
        
        resultsContainer.innerHTML = results;
    }, 1000);
}

function startVulnScan() {
    const target = document.getElementById('vuln-target').value.trim();
    
    if (!target) {
        alert('Please enter a website URL');
        return;
    }
    
    const progressContainer = document.getElementById('vuln-progress');
    const resultsContainer = document.getElementById('vuln-results');
    const progressFill = progressContainer.querySelector('.progress-fill');
    const progressText = progressContainer.querySelector('.progress-text');
    
    progressContainer.style.display = 'block';
    resultsContainer.innerHTML = '';
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10 + 3;
        if (progress > 100) progress = 100;
        
        progressFill.style.width = progress + '%';
        progressText.textContent = `Scanning ${target}... ${Math.floor(progress)}%`;
        
        if (progress >= 100) {
            clearInterval(interval);
            progressContainer.style.display = 'none';
            
            // Simulate vulnerability results
            const vulnerabilities = [
                { name: 'Missing Security Headers', severity: 'Medium', description: 'X-Frame-Options header not set' },
                { name: 'SSL/TLS Configuration', severity: 'Low', description: 'Using older TLS version' },
                { name: 'Directory Listing', severity: 'Low', description: 'Directory listing enabled' }
            ];
            
            let results = '<h5>Vulnerability Scan Results:</h5>';
            vulnerabilities.forEach(vuln => {
                const severityClass = vuln.severity.toLowerCase();
                results += `
                    <div class="vuln-result ${severityClass}">
                        <div class="vuln-name">${vuln.name}</div>
                        <div class="vuln-severity">${vuln.severity}</div>
                        <div class="vuln-desc">${vuln.description}</div>
                    </div>
                `;
            });
            
            resultsContainer.innerHTML = results;
        }
    }, 300);
}

function analyzeFile() {
    const fileInput = document.getElementById('forensic-file');
    const resultsContainer = document.getElementById('file-analysis');
    
    if (!fileInput.files[0]) {
        alert('Please select a file to analyze');
        return;
    }
    
    const file = fileInput.files[0];
    resultsContainer.innerHTML = '<div class="scanning">Analyzing file...</div>';
    
    setTimeout(() => {
        const mockAnalysis = {
            filename: file.name,
            size: file.size + ' bytes',
            type: file.type || 'Unknown',
            md5: 'a1b2c3d4e5f6...',
            sha1: '1a2b3c4d5e6f...',
            sha256: '1234567890abcdef...',
            created: new Date(file.lastModified).toLocaleString(),
            entropy: '7.2 (High)',
            suspicious: Math.random() < 0.3 ? 'Yes' : 'No'
        };
        
        let results = '<h5>File Analysis Results:</h5>';
        Object.entries(mockAnalysis).forEach(([key, value]) => {
            results += `<div class="analysis-item"><strong>${key.toUpperCase()}:</strong> ${value}</div>`;
        });
        
        resultsContainer.innerHTML = results;
    }, 2000);
}

function extractMetadata() {
    const fileInput = document.getElementById('metadata-file');
    const resultsContainer = document.getElementById('metadata-results');
    
    if (!fileInput.files[0]) {
        alert('Please select a file to extract metadata');
        return;
    }
    
    const file = fileInput.files[0];
    resultsContainer.innerHTML = '<div class="scanning">Extracting metadata...</div>';
    
    setTimeout(() => {
        const mockMetadata = {
            filename: file.name,
            size: file.size + ' bytes',
            type: file.type,
            lastModified: new Date(file.lastModified).toLocaleString(),
            camera: 'Canon EOS 5D Mark IV',
            gps: '37.7749, -122.4194',
            software: 'Adobe Photoshop CC',
            author: 'John Doe'
        };
        
        let results = '<h5>Metadata Extraction Results:</h5>';
        Object.entries(mockMetadata).forEach(([key, value]) => {
            results += `<div class="metadata-item"><strong>${key.toUpperCase()}:</strong> ${value}</div>`;
        });
        
        resultsContainer.innerHTML = results;
    }, 1500);
}

function closeModal() {
    document.getElementById('tool-modal').style.display = 'none';
}

// Initialize dashboard
let dashboard;
document.addEventListener('DOMContentLoaded', () => {
    dashboard = new CyberDashboard();
});

// Handle modal close
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal').forEach(modal => modal.style.display = 'none');
    }
});
