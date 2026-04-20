// 聊天机器人组件 - 独立JS版本
// 使用方法：在 index.html 中引入 <script src="/chatbot.js"></script>

(function() {
  // 创建样式
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
    .chatbot-btn:hover {
      transform: scale(1.1);
      background: #40a9ff;
    }
    .chat-panel {
      position: fixed;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 2px 20px rgba(0,0,0,0.3);
      z-index: 9999;
      display: none;
      flex-direction: column;
      overflow: hidden;
      min-width: 300px;
      min-height: 300px;
    }
    .chat-panel.show {
      display: flex;
    }
    .chat-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      background: #1890ff;
      color: #fff;
      cursor: move;
      user-select: none;
    }
    .chat-header button {
      background: none;
      border: none;
      color: #fff;
      font-size: 18px;
      cursor: pointer;
    }
    .chat-panel iframe {
      flex: 1;
      width: 100%;
      border: none;
    }
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
  panel.style.left = '100px'
  panel.style.top = '100px'
  panel.style.width = '400px'
  panel.style.height = '500px'

  const header = document.createElement('div')
  header.className = 'chat-header'
  header.innerHTML = '<span>RAG智能问答</span><button>✕</button>'

  const iframe = document.createElement('iframe')
  iframe.src = 'http://localhost:5050'

  const resizeHandle = document.createElement('div')
  resizeHandle.className = 'resize-handle'

  panel.appendChild(header)
  panel.appendChild(iframe)
  panel.appendChild(resizeHandle)

  document.body.appendChild(btn)
  document.body.appendChild(panel)

  // 点击按钮切换显示
  btn.addEventListener('click', () => {
    panel.classList.toggle('show')
  })

  // 点击关闭按钮
  header.querySelector('button').addEventListener('click', (e) => {
    e.stopPropagation()
    panel.classList.remove('show')
  })

  // 拖动功能
  let isDragging = false
  let dragStart = { x: 0, y: 0 }

  header.addEventListener('mousedown', (e) => {
    isDragging = true
    dragStart.x = e.clientX - parseInt(panel.style.left)
    dragStart.y = e.clientY - parseInt(panel.style.top)
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return
    panel.style.left = (e.clientX - dragStart.x) + 'px'
    panel.style.top = (e.clientY - dragStart.y) + 'px'
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
  })

  // 调整大小功能
  let isResizing = false
  let resizeStart = { x: 0, y: 0, width: 0, height: 0 }

  resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true
    resizeStart.x = e.clientX
    resizeStart.y = e.clientY
    resizeStart.width = parseInt(panel.style.width)
    resizeStart.height = parseInt(panel.style.height)
    e.stopPropagation()
  })

  document.addEventListener('mousemove', (e) => {
    if (!isResizing) return
    const newWidth = Math.max(300, resizeStart.width + (e.clientX - resizeStart.x))
    const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y))
    panel.style.width = newWidth + 'px'
    panel.style.height = newHeight + 'px'
  })

  document.addEventListener('mouseup', () => {
    isResizing = false
  })
})()
