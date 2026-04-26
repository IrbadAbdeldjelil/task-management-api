const express = require('express');
const morgan = require('morgan');
//const cookieParser = require('cookie-parser');
const hemet = require('helmet');
const cors = require('cors');
const { ZodError } = require('zod');
const authRoutes = require('./routes/auth.routes');
const tasksRoutes = require('./routes/tasks.routes');
const adminRoutes = require('./routes/admin.routes');
const { limiter } = require('./middlewares/limit.middleware');
const app = express();

const isDev = process.env.NODE_ENV === 'development';

// security middlewares
app.use(hemet());
app.use(cors());
   
app.use(express.json({limit: '10kb'}));
app.use(express.urlencoded({ extended: true}));
//app.use(cookieParser());
// logging
if (isDev) {
    app.use(morgan('dev'));
}

app.use(limiter);
// auth routes
app.use('/api/v1/auth', authRoutes);
// tasks routes
app.use('/api/v1/tasks', tasksRoutes);
// admin routes
app.use('/api/v1/admin', adminRoutes);

// error handler
app.use(function (err, req, res, next) {
     if (isDev) {
      console.error(err.stack)
     }

    let statusCode = err.status || 500;
    let message = err.message || 'Something broke!';
    
    // validation errors
    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'validation errors',
            data: null,
            errors: err.issues.map(e=> ({
                field: e.path.join('.'),
                message: e.message
            })),
            time: new Date().toISOString() 
        })
    }

    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
        data: null,
        errors: null,
        time: new Date().toISOString()
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({
        success: false,
        statusCode: 404,
        message: "not found",
        errors: null,
        data: null,
        time: new Date().toISOString()
    });
});

module.exports = app;