// 聊天机器人组件 - 直接调用API版本
// 修改后运行 sync-chatbot.py 同步到三个项目

(function() {
  const style = document.createElement('style')
  style.textContent = `
    .chatbot-btn {
      position: fixed;
      right: 20px;
      bottom: 20px;
      width: 50px;
      height: 50px;
      background: #1890ff;
      border-radius: 50%;
      font-size: 24px;
      cursor: pointer;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      transition: transform 0.2s;
    }
    .chatbot-btn:hover { transform: scale(1.1); background: #40a9ff; }
    
    .chat-panel {
      position: fixed;
      background: #1a1a2e;
      border-radius: 10px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.5);
      z-index: 9999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      min-width: 300px;
      min-height: 300px;
    }
    .chat-panel.show { display: flex; }
    .chat-panel.minimized { height: auto !important; }
    .chat-panel.minimized .chat-body { display: none; }
    
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: linear-gradient(90deg, #1890ff, #722ed1);
      color: #fff;
      cursor: move;
      user-select: none;
    }
    .chat-header span { font-weight: bold; }
    .chat-header-btns { display: flex; gap: 8px; }
    .chat-header-btns button {
      background: none;
      border: none;
      color: #fff;
      font-size: 16px;
      cursor: pointer;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
    }
    .chat-header-btns button:hover { background: rgba(255,255,255,0.2); }
    
    .chat-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      color: #e0e0e0;
      font-size: 14px;
      line-height: 1.6;
    }
    .chat-messages::-webkit-scrollbar { width: 6px; }
    .chat-messages::-webkit-scrollbar-thumb { background: #444; border-radius: 3px; }
    
    .msg { margin-bottom: 10px; padding: 8px 12px; border-radius: 8px; }
    .msg-user { background: #1890ff; color: #fff; margin-left: 20%; text-align: right; }
    .msg-bot { background: #2a2a4a; color: #e0e0e0; margin-right: 20%; }
    .msg-loading { color: #888; }
    
    .chat-input {
      display: flex;
      padding: 10px;
      background: #16213e;
      border-top: 1px solid #333;
    }
    .chat-input input {
      flex: 1;
      background: #0f0f23;
      border: 1px solid #444;
      border-radius: 6px;
      padding: 8px 12px;
      color: #fff;
      font-size: 14px;
      outline: none;
    }
    .chat-input input:focus { border-color: #1890ff; }
    .chat-input button {
      margin-left: 8px;
      background: #1890ff;
      border: none;
      border-radius: 6px;
      padding: 8px 16px;
      color: #fff;
      cursor: pointer;
      font-size: 14px;
    }
    .chat-input button:hover { background: #40a9ff; }
    
    .resize-handle {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 15px;
      height: 15px;
      cursor: se-resize;
      background: linear-gradient(135deg, transparent 50%, #1890ff 50%);
      border-radius: 0 0 10px 0;
    }
  `
  document.head.appendChild(style)

  // 创建DOM
  const btn = document.createElement('div')
  btn.className = 'chatbot-btn'
  btn.textContent = '🤖'

  const panel = document.createElement('div')
  panel.className = 'chat-panel'
  panel.style.cssText = 'right: 80px; bottom: 20px; width: 400px; height: 500px;'

  const header = document.createElement('div')
  header.className = 'chat-header'
  header.innerHTML = `
    <span>RAG智能问答</span>
    <div class="chat-header-btns">
      <button class="btn-min" title="最小化">−</button>
      <button class="btn-close" title="关闭">✕</button>
    </div>
  `

  const body = document.createElement('div')
  body.className = 'chat-body'

  const messages = document.createElement('div')
  messages.className = 'chat-messages'
  messages.innerHTML = `<div class="msg msg-bot">你好！我是RAG智能问答助手，可以帮你查询健康数据相关问题。</div>`

  const inputArea = document.createElement('div')
  inputArea.className = 'chat-input'
  inputArea.innerHTML = `
    <input type="text" placeholder="输入问题..." />
    <button>发送</button>
  `

  body.appendChild(messages)
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

  // 发送消息
  const input = inputArea.querySelector('input')
  const sendBtn = inputArea.querySelector('button')

  async function sendMessage() {
    const question = input.value.trim()
    if (!question) return

    // 显示用户消息
    messages.innerHTML += `<div class="msg msg-user">${question}</div>`
    input.value = ''
    messages.scrollTop = messages.scrollHeight

    // 显示加载中
    const loadingMsg = document.createElement('div')
    loadingMsg.className = 'msg msg-bot msg-loading'
    loadingMsg.textContent = '思考中...'
    messages.appendChild(loadingMsg)
    messages.scrollTop = messages.scrollHeight

    try {
      const res = await fetch('https://web-production-0d4fe.up.railway.app/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      const data = await res.json()
      const answer = data?.data?.answer || data?.answer || '没有获取到回答'
      loadingMsg.innerHTML = answer
      loadingMsg.classList.remove('msg-loading')
    } catch (err) {
      loadingMsg.textContent = '连接失败，请确保后端服务已启动 (https://web-production-0d4fe.up.railway.app)'
      loadingMsg.classList.remove('msg-loading')
    }
    messages.scrollTop = messages.scrollHeight
  }

  sendBtn.addEventListener('click', sendMessage)
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage()
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
    panel.style.width = Math.max(300, resizeStart.w + e.clientX - resizeStart.x) + 'px'
    panel.style.height = Math.max(300, resizeStart.h + e.clientY - resizeStart.y) + 'px'
  })
  document.addEventListener('mouseup', () => { isResizing = false })
})()
