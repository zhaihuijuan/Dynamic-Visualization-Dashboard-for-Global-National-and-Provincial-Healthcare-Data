// 聊天机器人组件 - Cyberpunk/Glitch 风格版本
// 修改后运行 sync-chatbot.py 同步到三个项目

(function() {
  // 加载 Google Fonts
  const fontLink = document.createElement('link')
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap'
  fontLink.rel = 'stylesheet'
  document.head.appendChild(fontLink)

  // 加载 marked.js 用于 Markdown 渲染
  const markedScript = document.createElement('script')
  markedScript.src = 'https://cdn.jsdelivr.net/npm/marked@11.1.1/marked.min.js'
  document.head.appendChild(markedScript)

  const style = document.createElement('style')
  style.textContent = `
    @keyframes blink {
      50% { opacity: 0; }
    }
    
    @keyframes glitch {
      0%, 100% { transform: translate(0); }
      20% { transform: translate(-2px, 2px); }
      40% { transform: translate(2px, -2px); }
      60% { transform: translate(-1px, -1px); }
      80% { transform: translate(1px, 1px); }
    }
    
    @keyframes rgbShift {
      0%, 100% { text-shadow: -2px 0 #ff00ff, 2px 0 #00d4ff; }
      50% { text-shadow: 2px 0 #ff00ff, -2px 0 #00d4ff; }
    }
    
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100%); }
    }

    .chatbot-btn {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 60px;
      height: 60px;
      background: #0a0a0f;
      border: 2px solid #00ff88;
      clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));
      font-size: 16px;
      font-weight: 900;
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 5px #00ff88, 0 0 10px rgba(0, 255, 136, 0.4), inset 0 0 20px rgba(0, 255, 136, 0.1);
      transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1);
      font-family: 'Orbitron', sans-serif;
      color: #00ff88;
      text-transform: uppercase;
      letter-spacing: 2px;
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
    }
    .chatbot-btn::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(45deg, #00ff88, #00d4ff, #ff00ff, #00ff88);
      background-size: 300% 300%;
      clip-path: polygon(0 10px, 10px 0, calc(100% - 10px) 0, 100% 10px, 100% calc(100% - 10px), calc(100% - 10px) 100%, 10px 100%, 0 calc(100% - 10px));
      z-index: -1;
      opacity: 0;
      transition: opacity 150ms;
    }
    .chatbot-btn:hover {
      background: #00ff88;
      color: #0a0a0f;
      box-shadow: 0 0 10px #00ff88, 0 0 20px rgba(0, 255, 136, 0.6), 0 0 40px rgba(0, 255, 136, 0.3);
      transform: translateY(-2px);
      text-shadow: none;
    }
    .chatbot-btn:hover::before {
      opacity: 0.3;
    }
    .chatbot-btn:active {
      transform: translateY(0);
    }
    
    .chat-panel {
      position: fixed;
      background: #0a0a0f;
      border: 2px solid #00ff88;
      clip-path: polygon(0 20px, 20px 0, calc(100% - 20px) 0, 100% 20px, 100% calc(100% - 20px), calc(100% - 20px) 100%, 20px 100%, 0 calc(100% - 20px));
      box-shadow: 0 0 10px #00ff88, 0 0 20px rgba(0, 255, 136, 0.6), 0 0 40px rgba(0, 255, 136, 0.3);
      z-index: 9999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      min-width: 320px;
      min-height: 400px;
      font-family: 'Share Tech Mono', monospace;
    }
    .chat-panel::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 0, 0, 0.3) 2px, rgba(0, 0, 0, 0.3) 4px);
      pointer-events: none;
      z-index: 100;
      opacity: 0.5;
    }
    .chat-panel::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 1;
    }
    .chat-panel.show { display: flex; }
    .chat-panel.minimized { height: auto !important; }
    .chat-panel.minimized .chat-body { display: none; }
    
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: linear-gradient(90deg, rgba(0, 255, 136, 0.1), rgba(0, 212, 255, 0.1));
      border-bottom: 1px solid #00ff88;
      color: #00ff88;
      cursor: move;
      user-select: none;
      position: relative;
      z-index: 10;
    }
    .chat-header::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 4px;
      height: 100%;
      background: linear-gradient(180deg, #00ff88, #00d4ff);
      box-shadow: 0 0 10px #00ff88;
    }
    .chat-header span { 
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 3px;
      font-size: 12px;
      text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
      animation: rgbShift 3s infinite;
    }
    .chat-header-dots {
      position: absolute;
      left: 16px;
      top: 50%;
      transform: translateY(-50%);
      display: flex;
      gap: 6px;
    }
    .chat-header-dot {
      width: 8px;
      height: 8px;
      border-radius: 0;
      clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
      box-shadow: 0 0 5px currentColor;
    }
    .chat-header-btns { 
      display: flex; 
      gap: 8px;
      margin-left: auto;
    }
    .chat-header-btns button {
      background: transparent;
      border: 1px solid #00ff88;
      color: #00ff88;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      clip-path: polygon(20% 0%, 80% 0%, 100% 20%, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0% 20%);
      transition: all 150ms;
      font-family: 'Share Tech Mono', monospace;
    }
    .chat-header-btns button:hover { 
      background: #00ff88;
      color: #0a0a0f;
      box-shadow: 0 0 10px #00ff88;
      transform: scale(1.1);
    }
    
    .chat-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
      z-index: 2;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      color: #e0e0e0;
      font-size: 13px;
      line-height: 1.6;
      letter-spacing: 0.5px;
    }
    .chat-messages::-webkit-scrollbar { 
      width: 8px; 
      background: #12121a;
    }
    .chat-messages::-webkit-scrollbar-thumb { 
      background: #00ff88;
      box-shadow: 0 0 5px #00ff88;
      clip-path: polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px));
    }
    .chat-messages::-webkit-scrollbar-thumb:hover {
      background: #00d4ff;
      box-shadow: 0 0 10px #00d4ff;
    }
    
    .msg { 
      margin-bottom: 16px; 
      padding: 10px 14px; 
      position: relative;
      border: 1px solid;
      transition: all 150ms;
      clip-path: polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px));
    }
    .msg::before {
      content: '>';
      position: absolute;
      left: -16px;
      top: 10px;
      font-weight: bold;
      font-size: 14px;
    }
    .msg-user { 
      background: rgba(0, 212, 255, 0.05);
      border-color: #00d4ff;
      color: #00d4ff;
      margin-left: 10%;
      text-align: right;
      box-shadow: 0 0 10px rgba(0, 212, 255, 0.2);
    }
    .msg-user::before {
      content: '$';
      color: #00d4ff;
      right: -16px;
      left: auto;
      text-shadow: 0 0 5px #00d4ff;
    }
    .msg-bot { 
      background: rgba(0, 255, 136, 0.05);
      border-color: #00ff88;
      color: #e0e0e0;
      margin-right: 10%;
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
    }
    .msg-bot::before {
      color: #00ff88;
      text-shadow: 0 0 5px #00ff88;
    }
    .msg:hover {
      box-shadow: 0 0 15px rgba(0, 255, 136, 0.4);
      transform: translateX(2px);
      border-color: #00ff88;
    }
    .msg-loading { 
      color: #ff00ff;
      animation: glitch 0.3s infinite;
    }
    .msg-loading::after {
      content: '_';
      animation: blink 1s step-end infinite;
    }
    
    /* Markdown 样式 */
    .msg-bot strong, .msg-bot b {
      color: #00ff88;
      font-weight: bold;
      text-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
    }
    .msg-bot em, .msg-bot i {
      color: #00d4ff;
      font-style: italic;
    }
    .msg-bot h1, .msg-bot h2, .msg-bot h3 {
      color: #00ff88;
      font-weight: bold;
      margin: 12px 0 8px 0;
      text-shadow: 0 0 8px rgba(0, 255, 136, 0.4);
      font-family: 'Orbitron', sans-serif;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .msg-bot h1 { font-size: 16px; }
    .msg-bot h2 { font-size: 14px; }
    .msg-bot h3 { font-size: 13px; }
    .msg-bot ul, .msg-bot ol {
      margin: 8px 0;
      padding-left: 20px;
    }
    .msg-bot li {
      margin: 4px 0;
      position: relative;
    }
    .msg-bot ul li::marker {
      content: '▸ ';
      color: #00ff88;
    }
    .msg-bot ol li::marker {
      color: #00ff88;
      font-weight: bold;
    }
    .msg-bot code {
      background: rgba(0, 255, 136, 0.1);
      border: 1px solid #2a2a3a;
      padding: 2px 6px;
      border-radius: 2px;
      color: #00d4ff;
      font-family: 'Share Tech Mono', monospace;
      font-size: 12px;
    }
    .msg-bot pre {
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid #00ff88;
      padding: 10px;
      margin: 8px 0;
      overflow-x: auto;
      clip-path: polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px));
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
    }
    .msg-bot pre code {
      background: none;
      border: none;
      padding: 0;
      color: #00ff88;
      font-size: 11px;
    }
    .msg-bot blockquote {
      border-left: 3px solid #00ff88;
      padding-left: 12px;
      margin: 8px 0;
      color: #6b7280;
      font-style: italic;
      box-shadow: -3px 0 10px rgba(0, 255, 136, 0.2);
    }
    .msg-bot a {
      color: #00d4ff;
      text-decoration: underline;
      transition: all 150ms;
    }
    .msg-bot a:hover {
      color: #00ff88;
      text-shadow: 0 0 5px #00ff88;
    }
    .msg-bot p {
      margin: 8px 0;
    }
    .msg-bot hr {
      border: none;
      border-top: 1px solid #2a2a3a;
      margin: 12px 0;
      box-shadow: 0 1px 5px rgba(0, 255, 136, 0.2);
    }
    
    .chat-input {
      display: flex;
      padding: 16px;
      background: rgba(18, 18, 26, 0.8);
      border-top: 1px solid #00ff88;
      gap: 12px;
      position: relative;
      z-index: 10;
    }
    .chat-input::before {
      content: '>';
      color: #00ff88;
      font-size: 18px;
      font-weight: bold;
      display: flex;
      align-items: center;
      text-shadow: 0 0 10px #00ff88;
      animation: blink 1.5s step-end infinite;
    }
    .chat-input input {
      flex: 1;
      background: #12121a;
      border: 1px solid #2a2a3a;
      clip-path: polygon(0 4px, 4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px));
      padding: 8px 12px;
      color: #00ff88;
      font-size: 13px;
      font-family: 'Share Tech Mono', monospace;
      outline: none;
      transition: all 150ms;
      letter-spacing: 1px;
    }
    .chat-input input::placeholder {
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 2px;
    }
    .chat-input input:focus { 
      border-color: #00ff88;
      box-shadow: 0 0 5px #00ff88, 0 0 10px rgba(0, 255, 136, 0.4);
    }
    .chat-input button {
      background: transparent;
      border: 2px solid #00ff88;
      clip-path: polygon(0 6px, 6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px));
      padding: 8px 20px;
      color: #00ff88;
      cursor: pointer;
      font-size: 11px;
      font-family: 'Share Tech Mono', monospace;
      text-transform: uppercase;
      letter-spacing: 2px;
      font-weight: bold;
      transition: all 150ms;
      box-shadow: 0 0 5px rgba(0, 255, 136, 0.3);
    }
    .chat-input button:hover { 
      background: #00ff88;
      color: #0a0a0f;
      box-shadow: 0 0 10px #00ff88, 0 0 20px rgba(0, 255, 136, 0.6);
      transform: translateY(-1px);
    }
    .chat-input button:active {
      transform: translateY(0);
    }
    
    .sample-questions {
      padding: 12px 16px;
      background: rgba(18, 18, 26, 0.6);
      border-bottom: 1px solid #2a2a3a;
      position: relative;
      z-index: 10;
    }
    .sample-questions-title {
      font-size: 10px;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .sample-questions-title::before {
      content: '//';
      color: #00ff88;
      text-shadow: 0 0 5px #00ff88;
    }
    .sample-question-btn {
      display: block;
      width: 100%;
      background: rgba(0, 255, 136, 0.05);
      border: 1px solid #2a2a3a;
      clip-path: polygon(0 3px, 3px 0, calc(100% - 3px) 0, 100% 3px, 100% calc(100% - 3px), calc(100% - 3px) 100%, 3px 100%, 0 calc(100% - 3px));
      color: #e0e0e0;
      padding: 8px 12px;
      margin-bottom: 6px;
      font-size: 11px;
      text-align: left;
      cursor: pointer;
      transition: all 150ms;
      font-family: 'Share Tech Mono', monospace;
      letter-spacing: 0.5px;
      line-height: 1.4;
    }
    .sample-question-btn:last-child {
      margin-bottom: 0;
    }
    .sample-question-btn::before {
      content: '>';
      color: #00ff88;
      margin-right: 6px;
      text-shadow: 0 0 5px #00ff88;
    }
    .sample-question-btn:hover {
      background: rgba(0, 255, 136, 0.1);
      border-color: #00ff88;
      color: #00ff88;
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
      transform: translateX(3px);
    }
    .sample-question-btn:active {
      transform: translateX(1px);
    }
    
    .resize-handle {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 20px;
      height: 20px;
      cursor: se-resize;
      background: transparent;
      border-right: 2px solid #00ff88;
      border-bottom: 2px solid #00ff88;
      transition: all 150ms;
      z-index: 101;
    }
    .resize-handle::before {
      content: '';
      position: absolute;
      right: 0;
      bottom: 0;
      width: 8px;
      height: 8px;
      background: #00ff88;
      box-shadow: 0 0 5px #00ff88;
    }
    .resize-handle:hover {
      border-color: #00d4ff;
      box-shadow: 0 0 10px rgba(0, 255, 136, 0.6);
    }
    .resize-handle:hover::before {
      background: #00d4ff;
      box-shadow: 0 0 10px #00d4ff;
    }
  `
  document.head.appendChild(style)

  // 创建DOM
  const btn = document.createElement('div')
  btn.className = 'chatbot-btn'
  btn.textContent = 'AI'

  const panel = document.createElement('div')
  panel.className = 'chat-panel'
  panel.style.cssText = 'right: 90px; bottom: 20px; width: 420px; height: 550px;'

  const header = document.createElement('div')
  header.className = 'chat-header'
  header.innerHTML = `
    <div class="chat-header-dots">
      <div class="chat-header-dot" style="background: #ff3366;"></div>
      <div class="chat-header-dot" style="background: #ffcc00;"></div>
      <div class="chat-header-dot" style="background: #00ff88;"></div>
    </div>
    <span>// RAG_TERMINAL_v3.14</span>
    <div class="chat-header-btns">
      <button class="btn-min" title="最小化">−</button>
      <button class="btn-close" title="关闭">✕</button>
    </div>
  `

  const body = document.createElement('div')
  body.className = 'chat-body'

  const messages = document.createElement('div')
  messages.className = 'chat-messages'
  messages.innerHTML = `<div class="msg msg-bot">> SYSTEM_BOOT_COMPLETE<br/>> NEURAL_NETWORK_ONLINE<br/>> RAG_MODULE_INITIALIZED<br/><br/>你好！我是RAG智能问答助手。<br/>输入查询以访问健康数据库。</div>`

  const sampleQuestions = document.createElement('div')
  sampleQuestions.className = 'sample-questions'
  sampleQuestions.innerHTML = `
    <div class="sample-questions-title">SAMPLE_QUERIES</div>
    <button class="sample-question-btn" data-question="请根据项目给辽宁省生成政策建议结论。">请根据项目给辽宁省生成政策建议结论。</button>
    <button class="sample-question-btn" data-question="江苏省当前最该优先调整什么？">江苏省当前最该优先调整什么？</button>
    <button class="sample-question-btn" data-question="吉林为什么要优先缩小城乡卫技差？">吉林为什么要优先缩小城乡卫技差？</button>
  `

  const inputArea = document.createElement('div')
  inputArea.className = 'chat-input'
  inputArea.innerHTML = `
    <input type="text" placeholder="ENTER_QUERY" />
    <button>EXEC</button>
  `

  body.appendChild(messages)
  body.appendChild(sampleQuestions)
  body.appendChild(inputArea)

  const resizeHandle = document.createElement('div')
  resizeHandle.className = 'resize-handle'

  panel.appendChild(header)
  panel.appendChild(body)
  panel.appendChild(resizeHandle)

  document.body.appendChild(btn)
  document.body.appendChild(panel)

  // 状态
  let isMinimized = false

  // 点击按钮切换显示
  btn.addEventListener('click', () => {
    panel.classList.toggle('show')
    if (panel.classList.contains('show') && isMinimized) {
      panel.classList.remove('minimized')
      isMinimized = false
    }
  })

  // 最小化
  header.querySelector('.btn-min').addEventListener('click', (e) => {
    e.stopPropagation()
    isMinimized = !isMinimized
    panel.classList.toggle('minimized')
  })

  // 关闭
  header.querySelector('.btn-close').addEventListener('click', (e) => {
    e.stopPropagation()
    panel.classList.remove('show')
  })

  // Markdown 渲染函数
  function renderMarkdown(text) {
    // 等待 marked.js 加载完成
    if (typeof marked === 'undefined') {
      return text.replace(/\n/g, '<br/>')
    }
    try {
      return marked.parse(text)
    } catch (e) {
      return text.replace(/\n/g, '<br/>')
    }
  }

  // 发送消息
  const input = inputArea.querySelector('input')
  const sendBtn = inputArea.querySelector('button')

  async function sendMessage() {
    const question = input.value.trim()
    if (!question) return

    // 显示用户消息（转义 HTML）
    const userMsgDiv = document.createElement('div')
    userMsgDiv.className = 'msg msg-user'
    userMsgDiv.textContent = question
    messages.appendChild(userMsgDiv)
    input.value = ''
    messages.scrollTop = messages.scrollHeight

    // 显示加载中
    const loadingMsg = document.createElement('div')
    loadingMsg.className = 'msg msg-bot msg-loading'
    loadingMsg.innerHTML = '> PROCESSING_QUERY<br/>> ACCESSING_DATABASE<br/>> ANALYZING_DATA'
    messages.appendChild(loadingMsg)
    messages.scrollTop = messages.scrollHeight

    try {
      const API_BASE = 'https://web-production-0d4fe.up.railway.app'
      const res = await fetch(`${API_BASE}/api/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      const answer = data?.data?.answer || data?.answer || '> ERROR: NO_RESPONSE'
      
      // 使用 Markdown 渲染回答
      const renderedAnswer = renderMarkdown(answer)
      loadingMsg.innerHTML = '> RESPONSE_RECEIVED:<br/><br/>' + renderedAnswer
      loadingMsg.classList.remove('msg-loading')
    } catch (err) {
      loadingMsg.innerHTML = '> CONNECTION_ERROR<br/>> SERVICE_OFFLINE<br/>> RETRY_LATER<br/><br/>URL: https://web-production-0d4fe.up.railway.app/'
      loadingMsg.classList.remove('msg-loading')
    }
    messages.scrollTop = messages.scrollHeight
  }

  sendBtn.addEventListener('click', sendMessage)
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage()
  })

  // 示例问题点击事件
  sampleQuestions.querySelectorAll('.sample-question-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question')
      input.value = question
      sendMessage()
    })
  })

  // 拖动
  let isDragging = false, dragStart = { x: 0, y: 0 }
  header.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return
    isDragging = true
    const rect = panel.getBoundingClientRect()
    dragStart.x = e.clientX - rect.left
    dragStart.y = e.clientY - rect.top
  })
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    panel.style.left = (e.clientX - dragStart.x) + 'px'
    panel.style.top = (e.clientY - dragStart.y) + 'px'
    panel.style.right = 'auto'
    panel.style.bottom = 'auto'
  })
  document.addEventListener('mouseup', () => { isDragging = false })

  // 调整大小
  let isResizing = false, resizeStart = { x: 0, y: 0, w: 0, h: 0 }
  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true
    resizeStart = { x: e.clientX, y: e.clientY, w: panel.offsetWidth, h: panel.offsetHeight }
    e.stopPropagation()
  })
  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return
    panel.style.width = Math.max(320, resizeStart.w + e.clientX - resizeStart.x) + 'px'
    panel.style.height = Math.max(400, resizeStart.h + e.clientY - resizeStart.y) + 'px'
  })
  document.addEventListener('mouseup', () => { isResizing = false })
})()
