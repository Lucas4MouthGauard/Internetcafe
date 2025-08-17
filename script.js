// 全局变量
let currentWindow = null;
let isSlowMode = false;
let networkCardShown = false;
let illegalOperationCount = 0;

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeDesktop();
    initializeClock();
    initializeBubbleGame();
    setupEventListeners();
});

// 初始化桌面
function initializeDesktop() {
    console.log('Windows 98 system starting...');
    
    // Randomly show network card prompt
    setTimeout(() => {
        if (Math.random() < 0.3) {
            showNetworkCardModal();
        }
    }, 2000 + Math.random() * 3000);
    
    // Randomly show system notice
    setTimeout(() => {
        if (Math.random() < 0.2) {
            showSystemDialog(
                'System Notice',
                'Welcome to Windows 98!\n\nSystem started successfully.\n\nIf you have any problems, please check the help documentation.',
                'ℹ️'
            );
        }
    }, 5000 + Math.random() * 5000);
}

// 初始化时钟
function initializeClock() {
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('zh-CN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        document.querySelector('.clock').textContent = timeString;
    }
    
    updateClock();
    setInterval(updateClock, 1000);
}

// 设置事件监听器
function setupEventListeners() {
    // 桌面图标点击
    document.querySelectorAll('.desktop-icon').forEach(icon => {
        icon.addEventListener('click', function() {
            const app = this.dataset.app;
            console.log('Desktop icon clicked:', app); // 调试信息
            openApplication(app);
        });
    });

    // 开始按钮
    document.querySelector('.start-button').addEventListener('click', function() {
        toggleStartMenu();
    });

    // 开始菜单项目
    document.querySelectorAll('.start-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const menuType = this.dataset.menu;
            handleStartMenuItem(menuType);
        });
    });

    // 子菜单项目
    document.querySelectorAll('.submenu-item').forEach(item => {
        item.addEventListener('click', function() {
            const app = this.dataset.app;
            openApplication(app);
            closeAllSubmenus();
        });
    });

    // 任务栏项目
    document.querySelectorAll('.taskbar-item').forEach(item => {
        item.addEventListener('click', function() {
            const windowName = this.dataset.window;
            switchWindow(windowName);
        });
    });

    // 窗口控制按钮
    document.querySelectorAll('.window-controls .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const window = this.closest('.app-window');
            closeWindow(window);
        });
    });

    // 模态框关闭
    document.querySelectorAll('.modal .close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // 模态框按钮
    document.querySelectorAll('.modal .btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            closeModal(modal);
        });
    });

    // 慢速模式切换
    document.getElementById('slow-mode-btn').addEventListener('click', function() {
        toggleSlowMode();
    });

    // 浏览器按钮
    setupBrowserEvents();
    
    // QQ Login
    setupQQEvents();
    
    // 泡泡堂游戏控制
    setupGameEvents();
    
    // 新应用程序事件
    setupNewAppEvents();
    
    // 托盘图标事件
    setupTrayIcons();
}

// 打开应用程序
function openApplication(appName) {
    // 特殊处理不需要窗口的应用
    if (appName === 'twitter') {
        openTwitter();
        return;
    }
    
    if (appName === 'startpump') {
        openStartPump();
        return;
    }
    
    const window = document.getElementById(`${appName}-window`);
    if (window) {
        window.style.display = 'block';
        window.style.zIndex = getNextZIndex();
        currentWindow = window;
        
        // 更新任务栏
        updateTaskbar(appName);
        
        // 特殊处理
        switch(appName) {
            case 'ie':
                simulateBrowserLoading();
                break;
            case 'qq':
                // QQ opened normally
                break;
            case 'paopao':
                startBubbleGame();
                break;
            case 'mycomputer':
                showMyComputer();
                break;
            case 'notepad':
                // 记事本正常打开
                break;
            case 'calculator':
                // 计算器正常打开
                break;
            case 'paint':
                // 画图正常打开
                break;
            case 'minesweeper':
                // 扫雷正常打开
                break;
            case 'control-panel':
                // 控制面板正常打开
                break;
            case 'recent':
                showSystemDialog(
                    '最近文档',
                    '暂无最近打开的文档。\n\n最近使用的文档将显示在此处。',
                    '📋'
                );
                break;
            case 'my-documents':
                showSystemDialog(
                    'My Documents',
                    'Welcome to My Documents!\n\nContains:\n• Work Documents\n• Personal Files\n• Downloads\n• Picture Collection\n• Music Files\n\nDouble-click folder icons to view content.',
                    '📁'
                );
                break;
            case 'display':
                showSystemDialog(
                    '显示属性',
                    '当前显示设置：\n\n分辨率：1024x768\n颜色深度：16位\n刷新率：60Hz\n\n显示器：即插即用监视器\n\n点击"设置"按钮更改显示属性。',
                    '🖥️'
                );
                break;
            case 'sound':
                showSystemDialog(
                    '声音属性',
                    '当前音频设置：\n\n主音量：50%\n系统音效：开启\n麦克风：关闭\n\n音频设备：Sound Blaster 16\n\n点击"设置"按钮调整音频属性。',
                    '🔊'
                );
                break;
        }
    }
}

// 获取下一个Z-index
function getNextZIndex() {
    const windows = document.querySelectorAll('.app-window');
    let maxZ = 100;
    windows.forEach(window => {
        const z = parseInt(window.style.zIndex) || 100;
        if (z > maxZ) maxZ = z;
    });
    return maxZ + 1;
}

// 更新任务栏
function updateTaskbar(appName) {
    document.querySelectorAll('.taskbar-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const taskbarItem = document.querySelector(`[data-window="${appName}"]`);
    if (taskbarItem) {
        taskbarItem.classList.add('active');
    }
}

// 切换窗口
function switchWindow(windowName) {
    if (windowName === 'desktop') {
        closeAllWindows();
        return;
    }
    
    const window = document.getElementById(`${windowName}-window`);
    if (window) {
        if (window.style.display === 'none') {
            openApplication(windowName);
        } else {
            window.style.zIndex = getNextZIndex();
            currentWindow = window;
        }
    }
}

// 关闭窗口
function closeWindow(window) {
    if (window) {
        window.style.display = 'none';
        currentWindow = null;
    }
}

// 关闭所有窗口
function closeAllWindows() {
    document.querySelectorAll('.app-window').forEach(window => {
        window.style.display = 'none';
    });
    currentWindow = null;
}

// 切换开始菜单
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    if (startMenu.style.display === 'none') {
        startMenu.style.display = 'block';
        startMenu.style.zIndex = getNextZIndex();
    } else {
        startMenu.style.display = 'none';
    }
}

// 显示网卡模态框
function showNetworkCardModal() {
    if (!networkCardShown) {
        const modal = document.getElementById('network-card-modal');
        modal.style.display = 'block';
        networkCardShown = true;
        
        // 播放系统提示音效果
        playSystemSound('warning');
    }
}

// 显示非法操作模态框
function showIllegalOperationModal() {
    const modal = document.getElementById('illegal-operation-modal');
    modal.style.display = 'block';
    illegalOperationCount++;
    
    // 播放错误音效
    playSystemSound('error');
    
    // 自动关闭错误对话框
    setTimeout(() => {
        if (modal.style.display === 'block') {
            modal.style.display = 'none';
        }
    }, 5000);
}

// 关闭模态框
function closeModal(modal) {
    if (modal) {
        modal.style.display = 'none';
    }
}

// 切换慢速模式
function toggleSlowMode() {
    const btn = document.getElementById('slow-mode-btn');
    const desktop = document.getElementById('desktop');
    
    isSlowMode = !isSlowMode;
    
    if (isSlowMode) {
        desktop.classList.add('slow-mode');
        btn.classList.add('active');
        btn.textContent = '正常模式';
        console.log('慢速模式已启用');
    } else {
        desktop.classList.remove('slow-mode');
        btn.classList.remove('active');
        btn.textContent = '慢速模式';
        console.log('慢速模式已关闭');
    }
}

// 浏览器加载
function simulateBrowserLoading() {
    const loadingIndicator = document.querySelector('.loading-indicator');
    const browserPage = document.querySelector('.browser-page');
    const urlBar = document.querySelector('.url-bar');
    
    if (loadingIndicator && browserPage) {
        loadingIndicator.style.display = 'block';
        browserPage.style.display = 'none';
        
        // 随机决定是否出现非法操作
        if (Math.random() < 0.4 && illegalOperationCount < 3) {
            setTimeout(() => {
                showIllegalOperationModal();
                loadingIndicator.style.display = 'none';
            }, 2000 + Math.random() * 2000);
        } else {
            // 正常加载
            setTimeout(() => {
                loadingIndicator.style.display = 'none';
                browserPage.style.display = 'block';
                
                // 更新URL显示
                if (urlBar) {
                    urlBar.value = 'http://www.baidu.com';
                }
            }, 3000 + Math.random() * 2000);
        }
    }
}

// 加载网站
function loadWebsite(site) {
    const loadingIndicator = document.querySelector('.loading-indicator');
    const browserPage = document.querySelector('.browser-page');
    const urlBar = document.querySelector('.url-bar');
    
    if (loadingIndicator && browserPage) {
        loadingIndicator.style.display = 'block';
        browserPage.style.display = 'none';
        
        let siteInfo = {
            name: '',
            url: '',
            content: ''
        };
        
        switch(site) {
            case 'baidu':
                siteInfo = {
                    name: '百度',
                    url: 'http://www.baidu.com',
                    content: `
                        <h2>百度一下，你就知道</h2>
                        <div style="text-align: center; margin: 30px 0;">
                                                          <input type="text" style="width: 300px; padding: 10px; font-size: 16px;" placeholder="Enter search content">
                            <button style="padding: 10px 20px; margin-left: 10px; background: #3385ff; color: white; border: none;">Baidu Search</button>
                        </div>
                        <p>World's largest Chinese search engine, providing web, image, video, news, map and other search services.</p>
                    `
                };
                break;
            case 'sina':
                siteInfo = {
                    name: '新浪网',
                    url: 'http://www.sina.com.cn',
                    content: `
                        <h2>新浪网 - 新闻资讯门户</h2>
                        <div style="border: 1px solid #ccc; padding: 20px; margin: 20px 0;">
                            <h3>今日头条</h3>
                            <ul>
                                <li>重要新闻标题一</li>
                                <li>重要新闻标题二</li>
                                <li>重要新闻标题三</li>
                            </ul>
                        </div>
                        <p>新浪网是中国最大的新闻资讯门户网站之一。</p>
                    `
                };
                break;
            case 'sohu':
                siteInfo = {
                    name: '搜狐网',
                    url: 'http://www.sohu.com',
                    content: `
                        <h2>搜狐网 - 综合门户网站</h2>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
                            <div style="border: 1px solid #ccc; padding: 15px;">
                                <h3>新闻</h3>
                                <p>最新新闻资讯</p>
                            </div>
                            <div style="border: 1px solid #ccc; padding: 15px;">
                                <h3>娱乐</h3>
                                <p>娱乐新闻和八卦</p>
                            </div>
                        </div>
                        <p>搜狐网是中国领先的综合门户网站。</p>
                    `
                };
                break;
            case '163':
                siteInfo = {
                    name: '网易',
                    url: 'http://www.163.com',
                    content: `
                        <h2>网易 - 综合门户网站</h2>
                        <div style="background: #f5f5f5; padding: 20px; margin: 20px 0;">
                            <h3>热门内容</h3>
                            <ul>
                                <li>网易新闻</li>
                                <li>网易邮箱</li>
                                <li>网易游戏</li>
                                <li>网易云音乐</li>
                            </ul>
                        </div>
                        <p>网易是中国领先的互联网技术公司。</p>
                    `
                };
                break;
        }
        
        // 更新URL
        if (urlBar) {
            urlBar.value = siteInfo.url;
        }
        
        // 加载时间
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
            browserPage.style.display = 'block';
            
            // 更新页面内容
            browserPage.innerHTML = siteInfo.content;
        }, 2000 + Math.random() * 1000);
    }
}

// 设置浏览器事件
function setupBrowserEvents() {
    const refreshBtn = document.querySelector('.browser-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            if (this.textContent === '刷新') {
                simulateBrowserLoading();
            }
        });
    }
    
    const urlBar = document.querySelector('.url-bar');
    if (urlBar) {
        urlBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                simulateBrowserLoading();
            }
        });
    }
}

// 设置QQ事件
function setupQQEvents() {
    const loginBtn = document.querySelector('.login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            const qqLogin = document.querySelector('.qq-login');
            const qqFriends = document.querySelector('.qq-friends');
            
            if (qqLogin && qqFriends) {
                qqLogin.style.display = 'none';
                qqFriends.style.display = 'block';
                
                        // 播放QQ登录音效
        playSystemSound('login');
            }
        });
    }
}

// 设置游戏事件
function setupGameEvents() {
    const gameBtns = document.querySelectorAll('.game-btn');
    gameBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.textContent === '开始游戏') {
                startBubbleGame();
            } else if (this.textContent === '暂停') {
                pauseBubbleGame();
            }
        });
    });
}

// 设置新应用程序事件
function setupNewAppEvents() {
    // 计算器事件
    setupCalculator();
    
    // 画图事件
    setupPaint();
    
    // 扫雷事件
    setupMinesweeper();
    
    // 控制面板事件
    setupControlPanel();
}

// 计算器相关变量
let calcDisplay = '0';
let calcFirstNumber = null;
let calcOperation = null;
let calcNewNumber = true;

// 设置计算器
function setupCalculator() {
    const calcBtns = document.querySelectorAll('.calc-btn');
    const calcDisplayEl = document.querySelector('.calc-display');
    
    if (!calcBtns.length || !calcDisplayEl) return;
    
    calcBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const value = this.textContent;
            
            if (value >= '0' && value <= '9' || value === '.') {
                if (calcNewNumber) {
                    calcDisplay = value;
                    calcNewNumber = false;
                } else {
                    calcDisplay += value;
                }
            } else if (value === 'C') {
                calcDisplay = '0';
                calcFirstNumber = null;
                calcOperation = null;
                calcNewNumber = true;
            } else if (value === '=') {
                if (calcFirstNumber !== null && calcOperation) {
                    const second = parseFloat(calcDisplay);
                    const first = parseFloat(calcFirstNumber);
                    let result;
                    
                    switch(calcOperation) {
                        case '+': result = first + second; break;
                        case '-': result = first - second; break;
                        case '×': result = first * second; break;
                        case '÷': result = first / second; break;
                    }
                    
                    calcDisplay = result.toString();
                    calcFirstNumber = null;
                    calcOperation = null;
                    calcNewNumber = true;
                }
            } else {
                calcFirstNumber = calcDisplay;
                calcOperation = value;
                calcNewNumber = true;
            }
            
            calcDisplayEl.value = calcDisplay;
        });
    });
}

// 画图相关变量
let paintCanvas, paintCtx;
let paintDrawing = false;
let paintTool = 'pencil';
let paintColor = '#000000';

// 设置画图
function setupPaint() {
    paintCanvas = document.getElementById('paint-canvas');
    if (!paintCanvas) return;
    
    paintCtx = paintCanvas.getContext('2d');
    
    // 工具按钮
    document.querySelectorAll('.paint-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.paint-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            paintTool = this.dataset.tool;
        });
    });
    
    // 颜色选择器
    const colorPicker = document.querySelector('.paint-color');
    if (colorPicker) {
        colorPicker.addEventListener('change', function() {
            paintColor = this.value;
        });
    }
    
    // 画布事件
    paintCanvas.addEventListener('mousedown', startDrawing);
    paintCanvas.addEventListener('mousemove', draw);
    paintCanvas.addEventListener('mouseup', stopDrawing);
    paintCanvas.addEventListener('mouseout', stopDrawing);
}

function startDrawing(e) {
    paintDrawing = true;
    draw(e);
}

function draw(e) {
    if (!paintDrawing) return;
    
    const rect = paintCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    paintCtx.strokeStyle = paintColor;
    paintCtx.lineWidth = 2;
    paintCtx.lineCap = 'round';
    
    if (paintTool === 'pencil') {
        paintCtx.lineTo(x, y);
        paintCtx.stroke();
        paintCtx.beginPath();
        paintCtx.moveTo(x, y);
    } else if (paintTool === 'eraser') {
        paintCtx.strokeStyle = '#ffffff';
        paintCtx.lineWidth = 10;
        paintCtx.lineTo(x, y);
        paintCtx.stroke();
        paintCtx.beginPath();
        paintCtx.moveTo(x, y);
    }
}

function stopDrawing() {
    paintDrawing = false;
    paintCtx.beginPath();
}

// 扫雷相关变量
let minesweeperGrid = [];
let minesweeperMines = 10;
let minesweeperGameOver = false;
let minesweeperTimer = 0;
let minesweeperTimerInterval;

// 设置扫雷
function setupMinesweeper() {
    const resetBtn = document.querySelector('.mine-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', initMinesweeper);
    }
    
    initMinesweeper();
}

function initMinesweeper() {
    const grid = document.getElementById('minesweeper-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    minesweeperGrid = [];
    minesweeperGameOver = false;
    minesweeperTimer = 0;
    
    // 创建网格
    for (let i = 0; i < 9; i++) {
        minesweeperGrid[i] = [];
        for (let j = 0; j < 9; j++) {
            const cell = document.createElement('div');
            cell.className = 'mine-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            cell.addEventListener('click', handleMineClick);
            cell.addEventListener('contextmenu', handleMineRightClick);
            
            grid.appendChild(cell);
            minesweeperGrid[i][j] = {
                element: cell,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                neighborMines: 0
            };
        }
    }
    
    // 放置地雷
    let minesPlaced = 0;
    while (minesPlaced < minesweeperMines) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        
        if (!minesweeperGrid[row][col].isMine) {
            minesweeperGrid[row][col].isMine = true;
            minesPlaced++;
        }
    }
    
    // 计算邻居地雷数
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (!minesweeperGrid[i][j].isMine) {
                minesweeperGrid[i][j].neighborMines = countNeighborMines(i, j);
            }
        }
    }
    
    // 重置计时器
    clearInterval(minesweeperTimerInterval);
    minesweeperTimerInterval = setInterval(updateMinesweeperTimer, 1000);
}

function countNeighborMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9) {
                if (minesweeperGrid[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function handleMineClick(e) {
    if (minesweeperGameOver) return;
    
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const cell = minesweeperGrid[row][col];
    
    if (cell.isFlagged || cell.isRevealed) return;
    
    if (cell.isMine) {
        // 游戏结束
        revealAllMines();
        minesweeperGameOver = true;
        document.querySelector('.mine-reset').textContent = '😵';
    } else {
        revealCell(row, col);
        checkWin();
    }
}

function handleMineRightClick(e) {
    e.preventDefault();
    if (minesweeperGameOver) return;
    
    const row = parseInt(e.target.dataset.row);
    const col = parseInt(e.target.dataset.col);
    const cell = minesweeperGrid[row][col];
    
    if (cell.isRevealed) return;
    
    cell.isFlagged = !cell.isFlagged;
    if (cell.isFlagged) {
        cell.element.classList.add('flagged');
        cell.element.textContent = '🚩';
    } else {
        cell.element.classList.remove('flagged');
        cell.element.textContent = '';
    }
}

function revealCell(row, col) {
    const cell = minesweeperGrid[row][col];
    if (cell.isRevealed || cell.isFlagged) return;
    
    cell.isRevealed = true;
    cell.element.classList.add('revealed');
    
    if (cell.neighborMines > 0) {
        cell.element.textContent = cell.neighborMines;
        cell.element.style.color = getMineNumberColor(cell.neighborMines);
    } else {
        // 递归显示空白区域
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < 9 && newCol >= 0 && newCol < 9) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
}

function getMineNumberColor(number) {
    const colors = ['', '#0000ff', '#008200', '#ff0000', '#000084', '#840000', '#008284', '#840084', '#757575'];
    return colors[number] || '#000000';
}

function revealAllMines() {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            const cell = minesweeperGrid[i][j];
            if (cell.isMine) {
                cell.element.classList.add('mine');
                cell.element.textContent = '💣';
            }
        }
    }
}

function checkWin() {
    let revealedCount = 0;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (minesweeperGrid[i][j].isRevealed) {
                revealedCount++;
            }
        }
    }
    
    if (revealedCount === 81 - minesweeperMines) {
        minesweeperGameOver = true;
        document.querySelector('.mine-reset').textContent = '😎';
        showSystemDialog(
            '扫雷',
            '恭喜！你赢了！\n\n你成功找到了所有地雷！\n\n用时：' + minesweeperTimer + ' 秒',
            '🎉'
        );
    }
}

function updateMinesweeperTimer() {
    if (!minesweeperGameOver) {
        minesweeperTimer++;
        document.querySelector('.mine-timer').textContent = `⏱️ ${minesweeperTimer}`;
    }
}

// 设置控制面板
function setupControlPanel() {
    const controlBtn = document.querySelector('.control-btn');
    if (controlBtn) {
        controlBtn.addEventListener('click', function() {
            showSystemDialog(
                '系统设置',
                '设置已成功应用！\n\n新的系统设置将在下次启动时生效。\n\n建议重新启动计算机以确保所有设置正确应用。',
                '✅'
            );
        });
    }
}

// 设置托盘图标
function setupTrayIcons() {
    const trayIcons = document.querySelectorAll('.tray-icon');
    
    trayIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const title = this.getAttribute('title');
            
            if (title === '音量控制') {
                showSystemDialog(
                    '音量控制',
                    '主音量: 50%\n\n系统音效: 开启\n麦克风: 关闭\n\n点击"设置"按钮调整音频属性。',
                    '🔊'
                );
            } else if (title === '网络状态') {
                showSystemDialog(
                    '网络状态',
                    '网络连接: 已连接\n\n连接类型: 局域网\nIP地址: 192.168.1.100\n\n网络适配器: Realtek RTL8029',
                    '📡'
                );
            }
        });
    });
}

// 显示我的电脑
function showMyComputer() {
    showSystemDialog(
        '我的电脑',
        'C: 系统盘 (NTFS)\nD: 数据盘 (FAT32)\nE: 光驱 (CD-ROM)\n\n总容量: 40GB\n可用空间: 15GB\n\n双击驱动器图标查看内容。',
        '💻'
    );
}

// 处理开始菜单项目
function handleStartMenuItem(menuType) {
    closeAllSubmenus();
    
    switch(menuType) {
        case 'programs':
            showSubmenu('programs-submenu');
            break;
        case 'documents':
            showSubmenu('documents-submenu');
            break;
        case 'settings':
            showSubmenu('settings-submenu');
            break;
        case 'help':
            showHelp();
            break;
        case 'logout':
            showLogoutDialog();
            break;
        case 'shutdown':
            showShutdownDialog();
            break;
    }
}

// 显示子菜单
function showSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    if (submenu) {
        submenu.style.display = 'block';
        submenu.style.zIndex = getNextZIndex();
    }
}

// 关闭所有子菜单
function closeAllSubmenus() {
    document.querySelectorAll('.submenu').forEach(submenu => {
        submenu.style.display = 'none';
    });
}

// 显示系统对话框
function showSystemDialog(title, message, icon = 'ℹ️', showCancel = false) {
    const dialog = document.getElementById('system-dialog');
    const titleEl = dialog.querySelector('.dialog-title');
    const messageEl = dialog.querySelector('.dialog-message');
    const iconEl = dialog.querySelector('.dialog-icon');
    const cancelBtn = dialog.querySelector('.dialog-cancel');
    
    titleEl.textContent = title;
    messageEl.textContent = message;
    iconEl.textContent = icon;
    cancelBtn.style.display = showCancel ? 'inline-block' : 'none';
    
    dialog.style.display = 'flex';
    dialog.style.zIndex = getNextZIndex();
    
    return new Promise((resolve) => {
        const okBtn = dialog.querySelector('.dialog-ok');
        const closeBtn = dialog.querySelector('.dialog-close');
        
        const closeDialog = (result) => {
            dialog.style.display = 'none';
            resolve(result);
        };
        
        okBtn.onclick = () => closeDialog(true);
        closeBtn.onclick = () => closeDialog(false);
        cancelBtn.onclick = () => closeDialog(false);
    });
}

// 显示帮助
function showHelp() {
    showSystemDialog(
        'Windows Help',
        'Welcome to Windows 98!\n\nMain Features:\n• Desktop Applications\n• Start Menu\n• Taskbar\n• System Settings\n\nFor more help, please contact the system administrator.',
        '❓'
    );
}

// 显示注销对话框
function showLogoutDialog() {
    showSystemDialog(
        'Logout Windows',
        'Are you sure you want to logout the current user?\n\nAfter logout, all open programs will be closed.\n\nUnsaved work may be lost.',
        '🔄',
        true
    ).then(result => {
        if (result) {
            executeLogout();
        }
    });
}

// 执行注销操作
function executeLogout() {
    // 显示注销进度
    showSystemDialog(
        'Logout Windows',
        'Logging out...\n\nPlease wait...\n\nClosing all programs...',
        '⏳'
    );
    
    setTimeout(() => {
        showSystemDialog(
            'Logout Windows',
            'Saving user settings...\n\nPlease wait...',
            '💾'
        );
        
        setTimeout(() => {
            showSystemDialog(
                'Logout Windows',
                'Logout completed.\n\nWelcome to Windows 98!',
                '👤'
            );
            
            setTimeout(() => {
                // 显示登录界面
                showLoginScreen();
            }, 2000);
        }, 2000);
    }, 2000);
}

// 显示登录界面
function showLoginScreen() {
    // 清空页面
    document.body.innerHTML = '';
    document.body.style.background = 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)';
    document.body.style.color = 'white';
    document.body.style.fontFamily = 'VT323, monospace';
    document.body.style.display = 'flex';
    document.body.style.justifyContent = 'center';
    document.body.style.alignItems = 'center';
    document.body.style.height = '100vh';
    
    const loginContainer = document.createElement('div');
    loginContainer.style.textAlign = 'center';
    loginContainer.style.background = 'rgba(0, 0, 0, 0.7)';
    loginContainer.style.padding = '40px';
    loginContainer.style.borderRadius = '10px';
    loginContainer.style.border = '2px solid #00a0ff';
    loginContainer.style.boxShadow = '0 0 20px rgba(0, 160, 255, 0.5)';
    
    loginContainer.innerHTML = `
        <div style="font-size: 2.5em; margin-bottom: 20px; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);">
            Windows 98
        </div>
        <div style="font-size: 1.2em; margin-bottom: 30px; color: #add8e6;">
            Second Edition
        </div>
        <div style="margin-bottom: 20px;">
            <input type="text" id="username" placeholder="Username" style="
                width: 200px; 
                padding: 10px; 
                margin: 5px; 
                border: 2px solid #00a0ff; 
                border-radius: 5px; 
                background: rgba(255,255,255,0.9); 
                color: #000; 
                font-family: inherit;
            ">
        </div>
        <div style="margin-bottom: 20px;">
            <input type="password" id="password" placeholder="Password" style="
                width: 200px; 
                padding: 10px; 
                margin: 5px; 
                border: 2px solid #00a0ff; 
                border-radius: 5px; 
                background: rgba(255,255,255,0.9); 
                color: #000; 
                font-family: inherit;
            ">
        </div>
        <div>
            <button onclick="login()" style="
                background: linear-gradient(to bottom, #00a0ff, #0080cc); 
                color: white; 
                border: none; 
                padding: 10px 30px; 
                font-size: 1.1em; 
                border-radius: 5px; 
                cursor: pointer; 
                margin: 5px;
                font-family: inherit;
            ">Login</button>
            <button onclick="shutdownFromLogin()" style="
                background: linear-gradient(to bottom, #ff6b6b, #ff4757); 
                color: white; 
                border: none; 
                padding: 10px 30px; 
                font-size: 1.1em; 
                border-radius: 5px; 
                cursor: pointer; 
                margin: 5px;
                font-family: inherit;
            ">Shutdown</button>
        </div>
    `;
    
    document.body.appendChild(loginContainer);
    
    // 添加回车键登录
    document.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            login();
        }
    });
}

// 登录函数
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter username and password');
        return;
    }
    
    // 显示登录进度
    document.body.innerHTML = `
        <div style="text-align: center; padding-top: 100px; color: white;">
            <div style="font-size: 18px; margin-bottom: 20px;">Logging in...</div>
            <div style="font-size: 14px; color: #add8e6;">Please wait...</div>
        </div>
    `;
    
    setTimeout(() => {
        // 重新加载页面，回到桌面
        location.reload();
    }, 2000);
}

// 从登录界面关机
function shutdownFromLogin() {
    if (confirm('Are you sure you want to shutdown the computer?')) {
        document.body.style.background = '#000';
        document.body.innerHTML = '<div style="color: white; text-align: center; padding-top: 50px; font-family: monospace;">Computer has been shut down</div>';
    }
}

// 显示关机对话框
function showShutdownDialog() {
    const shutdownDialog = document.getElementById('shutdown-dialog');
    shutdownDialog.style.display = 'flex';
    shutdownDialog.style.zIndex = getNextZIndex();
    
    const closeBtn = shutdownDialog.querySelector('.shutdown-close');
    const okBtn = shutdownDialog.querySelector('.shutdown-ok');
    const cancelBtn = shutdownDialog.querySelector('.shutdown-cancel');
    
    const closeDialog = () => {
        shutdownDialog.style.display = 'none';
    };
    
    closeBtn.onclick = closeDialog;
    cancelBtn.onclick = closeDialog;
    
    okBtn.onclick = () => {
        const selectedOption = shutdownDialog.querySelector('input[name="shutdown"]:checked').value;
        closeDialog();
        
        executeShutdownAction(selectedOption);
    };
}

// 执行关机操作
function executeShutdownAction(action) {
    let actionText = '';
    let icon = '⏳';
    
    switch(action) {
        case 'standby':
            actionText = 'Entering standby mode...\n\nPlease wait...';
            break;
        case 'shutdown':
            actionText = 'Shutting down computer...\n\nPlease wait...\n\nSaving system settings...';
            icon = '🔄';
            break;
        case 'restart':
            actionText = 'Restarting...\n\nPlease wait...\n\nSaving system settings...';
            icon = '🔄';
            break;
        case 'logout':
            actionText = 'Logging out...\n\nPlease wait...\n\nClosing all programs...';
            icon = '👤';
            break;
    }
    
    // 显示进度对话框
    const progressDialog = showSystemDialog(
        'System Operation',
        actionText,
        icon
    );
    
    // 执行系统操作过程
    setTimeout(() => {
        if (action === 'standby') {
            showSystemDialog(
                'System Status',
                'Computer has entered standby mode.\n\nPress any key to wake up the computer.',
                '💤'
            );
        } else if (action === 'shutdown') {
            showSystemDialog(
                'Shutdown Windows',
                'It is now safe to turn off your computer.\n\nIf the computer does not turn off automatically, please turn off the power manually.',
                '⏹️'
            );
            setTimeout(() => {
                // 关闭计算机
                document.body.style.background = '#000';
                document.body.innerHTML = '<div style="color: white; text-align: center; padding-top: 50px; font-family: monospace;">Computer has been shut down</div>';
            }, 3000);
        } else if (action === 'restart') {
            showSystemDialog(
                'Restart',
                'Restarting computer...\n\nPlease wait...',
                '🔄'
            );
            setTimeout(() => {
                // 执行重启序列
                showRestartSequence();
            }, 2000);
        } else if (action === 'logout') {
            showSystemDialog(
                '注销 Windows',
                '注销完成。\n\n欢迎使用 Windows 98！',
                '👤'
            );
            setTimeout(() => {
                location.reload();
            }, 2000);
        }
    }, 3000);
}

// 显示重启序列
function showRestartSequence() {
    // 清空页面
    document.body.innerHTML = '';
    document.body.style.background = '#000';
    document.body.style.color = '#fff';
    document.body.style.fontFamily = 'monospace';
    document.body.style.padding = '20px';
    
    const restartSteps = [
        'Restarting...',
        'Checking system files...',
        'Loading system configuration...',
        'Initializing devices...',
        'Starting Windows 98...',
        'Welcome to Windows 98!'
    ];
    
    let currentStep = 0;
    
    function showStep() {
        if (currentStep < restartSteps.length) {
            document.body.innerHTML = `
                <div style="text-align: center; padding-top: 100px;">
                    <div style="font-size: 18px; margin-bottom: 20px;">${restartSteps[currentStep]}</div>
                    <div style="font-size: 12px; color: #888;">
                        ${currentStep + 1} / ${restartSteps.length}
                    </div>
                </div>
            `;
            currentStep++;
            setTimeout(showStep, 1000);
        } else {
            // 重启完成，重新加载页面
            setTimeout(() => {
                location.reload();
            }, 1000);
        }
    }
    
    showStep();
}

// 泡泡堂游戏相关变量
let gameCanvas, gameCtx;
let gameRunning = false;
let bubbles = [];
let player = { x: 200, y: 250, size: 10, color: '#ff6b6b' };

// 初始化泡泡堂游戏
function initializeBubbleGame() {
    gameCanvas = document.getElementById('paopao-canvas');
    if (gameCanvas) {
        gameCtx = gameCanvas.getContext('2d');
        setupGameCanvas();
    }
}

// 设置游戏画布
function setupGameCanvas() {
    if (!gameCanvas || !gameCtx) return;
    
    // 设置画布背景
    gameCtx.fillStyle = '#87ceeb';
    gameCtx.fillRect(0, 0, gameCanvas.width, gameCanvas.height);
    
    // 绘制网格背景
    gameCtx.strokeStyle = '#add8e6';
    gameCtx.lineWidth = 1;
    for (let i = 0; i < gameCanvas.width; i += 20) {
        gameCtx.beginPath();
        gameCtx.moveTo(i, 0);
        gameCtx.lineTo(i, gameCanvas.height);
        gameCtx.stroke();
    }
    for (let i = 0; i < gameCanvas.height; i += 20) {
        gameCtx.beginPath();
        gameCtx.moveTo(0, i);
        gameCtx.lineTo(gameCanvas.width, i);
        gameCtx.stroke();
    }
}

// 开始泡泡堂游戏
function startBubbleGame() {
    if (!gameCanvas || !gameCtx) return;
    
    gameRunning = true;
    bubbles = [];
    
    // 创建初始泡泡
    for (let i = 0; i < 5; i++) {
        bubbles.push({
            x: Math.random() * gameCanvas.width,
            y: Math.random() * (gameCanvas.height - 50),
            size: 15 + Math.random() * 10,
            color: `hsl(${Math.random() * 360}, 70%, 60%)`,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2
        });
    }
    
    gameLoop();
}

// 游戏主循环
function gameLoop() {
    if (!gameRunning) return;
    
    // 清空画布
    setupGameCanvas();
    
    // 更新和绘制泡泡
    bubbles.forEach(bubble => {
        // 更新位置
        bubble.x += bubble.vx;
        bubble.y += bubble.vy;
        
        // 边界检测
        if (bubble.x <= bubble.size || bubble.x >= gameCanvas.width - bubble.size) {
            bubble.vx *= -1;
        }
        if (bubble.y <= bubble.size || bubble.y >= gameCanvas.height - bubble.size) {
            bubble.vy *= -1;
        }
        
        // 绘制泡泡
        gameCtx.beginPath();
        gameCtx.arc(bubble.x, bubble.y, bubble.size, 0, Math.PI * 2);
        gameCtx.fillStyle = bubble.color;
        gameCtx.fill();
        gameCtx.strokeStyle = '#fff';
        gameCtx.lineWidth = 2;
        gameCtx.stroke();
    });
    
    // 绘制玩家
    gameCtx.fillStyle = player.color;
    gameCtx.fillRect(player.x - player.size, player.y - player.size, player.size * 2, player.size * 2);
    
    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 暂停泡泡堂游戏
function pauseBubbleGame() {
    gameRunning = false;
}

// 播放系统音效
function playSystemSound(type) {
    // 创建音频上下文（如果需要的话）
    if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
        const audioContext = new (AudioContext || webkitAudioContext)();
        
        // 生成简单的音效
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        switch(type) {
            case 'warning':
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
                break;
            case 'error':
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime + 0.2);
                break;
            case 'login':
                oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
                oscillator.frequency.setValueAtTime(1200, audioContext.currentTime + 0.1);
                oscillator.frequency.setValueAtTime(1400, audioContext.currentTime + 0.2);
                break;
        }
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    }
}

// 窗口拖拽功能
document.addEventListener('mousedown', function(e) {
    const windowHeader = e.target.closest('.window-header');
    if (windowHeader) {
        const window = windowHeader.closest('.app-window');
        if (window) {
            window.style.zIndex = getNextZIndex();
            currentWindow = window;
            
            const startX = e.clientX - window.offsetLeft;
            const startY = e.clientY - window.offsetTop;
            
            function onMouseMove(e) {
                window.style.left = e.clientX - startX + 'px';
                window.style.top = e.clientY - startY + 'px';
                window.style.transform = 'none';
            }
            
            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    }
});

// 点击桌面关闭开始菜单
document.addEventListener('click', function(e) {
    if (!e.target.closest('.start-button') && !e.target.closest('.start-menu') && !e.target.closest('.submenu')) {
        document.getElementById('start-menu').style.display = 'none';
        closeAllSubmenus();
    }
});

// 随机系统事件
setInterval(() => {
    if (Math.random() < 0.1) {
        // 随机显示网卡提示
        if (!networkCardShown && Math.random() < 0.3) {
            showNetworkCardModal();
        }
    }
}, 10000);

// 控制台欢迎信息
console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    Windows 98 系统控制台                      ║
║                                                              ║
║  欢迎使用 Windows 98！                                       ║
║  系统信息：                                                   ║
║  • 操作系统：Windows 98 Second Edition                      ║
║  • 处理器：Intel Pentium III 500MHz                        ║
║  • 内存：128MB RAM                                          ║
║  • 硬盘：40GB IDE                                           ║
║  • 显卡：S3 Savage4 32MB                                    ║
║  • 声卡：Sound Blaster 16                                   ║
║  • 网卡：Realtek RTL8029                                    ║
║                                                              ║
║  输入 help() 查看系统命令                                     ║
╚══════════════════════════════════════════════════════════════╝
`);

// 全局帮助函数
window.help = function() {
    console.log(`
Windows 98 系统命令：
• help() - 显示此帮助信息
• showNetworkCard() - 显示网卡状态
• showIllegalOperation() - 显示系统错误
• toggleSlowMode() - 切换系统性能模式
• openApp('app_name') - 启动指定应用程序
• closeAllWindows() - 关闭所有窗口

可用应用程序：
• qq - QQ聊天程序
• paopao - 泡泡堂游戏
• ie - Internet Explorer浏览器
• notepad - 记事本
• calculator - 计算器
• paint - 画图
• minesweeper - 扫雷
• control-panel - 控制面板
• twitter - Twitter社交平台
• startpump - StartPump系统

系统信息：
• 版本：Windows 98 Second Edition
• 构建：4.10.2222 A
• 注册用户：网吧用户
• 产品ID：12345-OEM-1234567-12345
    `);
};

// 全局函数
window.showNetworkCard = showNetworkCardModal;
window.showIllegalOperation = showIllegalOperationModal;
window.toggleSlowMode = toggleSlowMode;
window.openApp = openApplication;
window.closeAllWindows = closeAllWindows;

// 打开Twitter
function openTwitter() {
    console.log('Twitter clicked!'); // 调试信息
    // 直接跳转到Twitter链接
    window.open('https://x.com/StartMenu_meme', '_blank');
}

// 打开StartPump页面
function openStartPump() {
    // 暂且不可跳转
    showSystemDialog(
        'StartPump',
        'Welcome to StartPump!\n\nThis feature is currently under development.\n\nPlease stay tuned for updates!',
        '🚀'
    );
} 