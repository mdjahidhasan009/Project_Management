const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    deadline: {
        type: String,
        require: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    isDone: {
        type: Boolean,
        require: true,
        default: false
    },
    members: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    discussion: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            time: {
                type: Date,
                default: Date.now(),
            },
            text: {
                type: String,
                require: true
            }
        }
    ],
    todos: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            addedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            time: {
                type: Date,
                default: Date.now()
            },
            doneAt: {
                type: Date,
                default: null
            },
            text: {
                type: String,
                require: true
            },
            done: {
                type: Boolean,
                default: false,
                require: true
            }
            ,
            subTodos: [
                {
                    user: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    addedBy: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    time: {
                        type: Date,
                        default: Date.now()
                    },
                    doneAt: {
                        type: Date,
                        default: null
                    },
                    text: {
                        type: String,
                        require: true
                    },
                    done: {
                        type: Boolean,
                        default: false,
                        require: true
                    }
                    ,
                }
            ]
        },
    ],
    bugs: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            time: {
                type: Date,
                default: Date.now()
            },
            fixedAt: {
                type: Date,
                default: null
            },
            text: {
                type: String,
                require: true
            },
            fixed: {
                type: Boolean,
                default: false,
                require: true
            }
        }
    ]
});

module.exports = mongoose.model('Project', projectSchema);
