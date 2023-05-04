import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import fs from 'fs';
import morgan from 'morgan';
import dotenv from 'dotenv';
import socket from 'socket.io';

dotenv.config();
const app = express();

const routerFiles = fs.readdirSync('./src/routes');
const PORT = process.env.PORT || 3001;

// middlewares
app.use(morgan('tiny'));
app.use(express.json());
app.use(cors());

// using router
routerFiles.forEach((file) => {
  app.use('/api', require(`./routes/${file}`).default);
});

const server = app.listen(PORT, () => {
  console.info(`Server listening on port ${PORT}`);
});

mongoose.set('strictQuery', true);
// connect database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    family: 4
    // Version node khác nhau chạy sẽ bị lỗi
  })
  .then(() => {
    console.info('Connect database successfully');
  })
  .catch((error) => {
    console.info(error);
  });

const io = socket(server, {
  cors: {
    origin: 'http://localhost:8081',
    credentials: true
  }
});
let activeUser = new Map();
let activeUserOrder = new Map();
io.on('connection', socket => {
  socket.on('join', (id) => {
    activeUser.set(id, socket.id);
    io.emit('join', {
      id: id
    });
    console.log('user:   ' + id);
  });
  socket.on('message', (data) => {
    const room = activeUser.get(data.room);
    io.to(room).emit('new message', {
      sender: data.sender,
      message: data.message
    });
    console.log(data);
  });
  socket.on('statusMessage', (data) => {
    const room = activeUser.get(data.sendTo);
    io.to(room).emit('statusMsg', {
      data
    });
  });

  socket.on('statusUser', (data) => {
    for (const item of activeUser.entries()) {
      if (item[0] !== data._id) {
        io.to(item[1]).emit('activeStatus', {
          data
        });
      }
    }
  });
  socket.on('disconnectUser', (data) => {
    for (const item of activeUser.entries()) {
      if (item[0] !== data._id) {
        io.to(item[1]).emit('activeStatus', {
          data
        });
      }
    }
  });
  socket.on('disconnect', () => {
    for (const item of activeUser.entries()) {
      if (item[1] === socket.id) {
        activeUser.delete(item[0]);
      }
    }
  });
});
