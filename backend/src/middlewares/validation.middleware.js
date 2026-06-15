 const {z} = require('zod');
 
 // user Id uuid
 const uuidSchema = z.object({
    id: z.uuidv4()
 })
 // signup
 const signupSchema = z.object({
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(6)
 });

 // signin
 const signinSchema = z.object({
    email: z.email(),
    password: z.string().min(6)
 });

//task
const todoSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'done']).optional(),
    priority: z.enum(['high', 'medium', 'low']),
    dueDate: z.string()
    .datetime({ message: "dueDate must be ISO 8601" })
    .refine((val) => new Date(val) > new Date(), {
      message: "dueDate must be in the future",
    })
    .optional()
    .nullable(), 
});

function validate(schema) {
    return async (req, res, next) => {
       
        const resaults = schema.safeParse(req.body);
        if(!resaults.success) return next(resaults.error);
        req.validated = resaults.data;
        next();
    };
};

// uuid validation
function validateUUID(schema) {
    return async (req, res, next) => {
       
        const resaults = schema.safeParse(req.params);
        if(!resaults.success) return next(resaults.error);
        req.uuid = resaults.data;
        next();
    };
};

module.exports = {
    signupSchema,
    signinSchema,
    todoSchema,
    uuidSchema,
    validate,
    validateUUID
};