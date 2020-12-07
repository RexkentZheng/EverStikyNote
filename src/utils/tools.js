import { v4 as uuidv4 } from 'uuid';

const { BrowserWindow, screen } = require('electron').remote

/**
 * @description: 将RGBA转化为16进制
 * @param {[Array]} colors 长度为4的数组
 * @return {String} 16进制的颜色表示方法
 */
const hexify = (colors) => {
  const a = parseFloat(colors.pop());
  const hexColors = colors.map((item) => {
    const orginNum = Math.floor(a * parseInt(item) + (1 - a) * 255)
    return `0${orginNum.toString(16)}`.slice(-2);
  })
  return `#${hexColors.join('')}`
}

const getRandomNum = (min, max) => Math.floor(Math.random()*(max-min+1)+min)

export const getRandomColor = () => {
  const colors = (new Array(3)).fill('').map(() => getRandomNum(128, 256)).concat([Math.random()])
  return hexify(colors)
}

export const newWindow = (uuid, color) => {
  const realUuid = uuid || uuidv4()
  const newPosition =screen.getDisplayNearestPoint(screen.getCursorScreenPoint()).bounds;
  const itemColor = color || getRandomColor()

  let childWindow = new BrowserWindow({
    width: 400,
    height: 300,
    x: newPosition.x + newPosition.width / 2 - 200,
    y: newPosition.y + newPosition.height / 2 - 150,
    webPreferences: {
      nodeIntegration: true
    },
    transparent: true,
    frame: false,
    vibrancy: 'popover',
  });

  const modalPath = process.env.NODE_ENV === 'development'
  ? `http://localhost:8081/#/note?id=${childWindow.id}&uuid=${realUuid}&color=${encodeURIComponent(itemColor)}`
  : `file://${__dirname}/index.html#note?id=${childWindow.id}&uuid=${realUuid}&color=${encodeURIComponent(itemColor)}`

  childWindow.loadURL(modalPath)
  
  childWindow.show()

  childWindow.on('closed', () => {
    childWindow = null;
  });

  return childWindow.id
}