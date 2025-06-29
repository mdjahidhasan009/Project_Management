"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const projectSchema = new mongoose_1.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
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
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            }
        }
    ],
    discussion: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User'
            },
            addedBy: {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
            },
            subTodos: [
                {
                    user: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
                        ref: 'User'
                    },
                    addedBy: {
                        type: mongoose_1.default.Schema.Types.ObjectId,
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
                    },
                }
            ]
        },
    ],
    bugs: [
        {
            user: {
                type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('Project', projectSchema);
