import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export class Player {
  _id?: mongoose.Types.ObjectId;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
  teams: mongoose.Types.ObjectId[]

  constructor(init: Player) {
    this._id = init._id || new mongoose.Types.ObjectId();
    this.name = init.name;
    this.position = init.position;
    this.dateOfBirth = init.dateOfBirth;
    this.nationality = init.nationality;
    this.teams = init.teams || [];
  }
}

export interface PlayerModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  position: string;
  dateOfBirth: string;
  nationality: string;
  teams: mongoose.Types.ObjectId[];
}

export const PlayerSchema = new mongoose.Schema(
  {
    name: { required: true, type: String },
    position: { required: true, type: String },
    dateOfBirth: { required: true, type: String },
    nationality: { required: true, type: String },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  }
);

