import { Request } from 'express';
import {Document, Types } from 'mongoose';

export interface IUser extends Document {
    id: string;
    name: string;
    username: string;
    email: string;
    role: string;
    bio: string;
    skills: string[];
    profileImage: {
        imageUrl: string;
        publicId: string;
    };
    social: {
        github?: string;
        youtube?: string;
        twitter?: string;
        facebook?: string;
        linkedIn?: string;
        instagram?: string;
        stackoverflow?: string;
    };
    password: string;
}

export interface IExpressRequestWithUser extends Request {
    user?: {
        id: string;
    };
}

export interface IDiscussion {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    time?: Date;
    text: string;
}

export interface ISubTodo {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    addedBy: Types.ObjectId;
    time?: Date;
    doneAt?: Date | null;
    text: string;
    done?: boolean;
}

export interface ITodo {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    addedBy: Types.ObjectId;
    time?: Date;
    doneAt?: Date | null;
    text: string;
    done?: boolean;
    subTodos?: ISubTodo[];
}

export interface IBug {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    time?: Date;
    fixedAt?: Date | null;
    text: string;
    fixed?: boolean;
}

export interface IMember {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
}

export interface IProject extends Document {
    name: string;
    category: string;
    description: string;
    deadline: string;
    createdBy: Types.ObjectId;
    isDone: boolean;
    members: IMember[];
    discussion: IDiscussion[];
    todos: ITodo[];
    bugs: IBug[];
}