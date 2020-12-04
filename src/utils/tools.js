import { v4 as uuidv4 } from 'uuid';
import colors from './colors'

const { BrowserWindow, screen } = require('electron').remote

export const getRandomColor = () => colors[parseInt(Math.random()*(colors.length+1),10)];

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
}