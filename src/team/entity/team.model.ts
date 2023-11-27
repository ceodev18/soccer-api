import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export class Team {
  _id?: mongoose.Types.ObjectId;
  name: string;
  tla: string;
  shortName: string;
  areaName: string;
  address: string;
  competitions: mongoose.Types.ObjectId[]

  constructor(init: Team) {
    this._id = init._id || new mongoose.Types.ObjectId();
    this.name = init.name;
    this.tla = init.tla;
    this.shortName = init.shortName;
    this.areaName = init.areaName;
    this.address = init.address;
    this.competitions = init.competitions || [];
  }
}

export interface TeamModel extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  tla: string;
  shortName: string;
  areaName: string;
  address: string;
  competitions: mongoose.Types.ObjectId[];
}

export const TeamSchema = new mongoose.Schema(
  {
    name: { required: true, type: String },
    tla: { required: true, type: String },
    shortName: { required: true, type: String },
    areaName: { required: true, type: String },
    address: { required: true, type: String },
    competitions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Competition' }],
  }
);

TeamSchema.virtual('players', {
  ref: 'Player',
  localField: '_id',
  foreignField: 'teams',
  justOne: false,
});

export class Coach {
  name: string;
  dateOfBirth: string;
  nationality: string;
  team: mongoose.Types.ObjectId[]

  constructor(init: Coach) {
    this.name = init.name;
    this.dateOfBirth = init.dateOfBirth;
    this.nationality = init.nationality;
    this.team = init.team || [];
  }
}
export interface CoachModel extends mongoose.Document {
  name: string;
  dateOfBirth: string;
  nationality: string;
  teams: mongoose.Types.ObjectId[];
}

export const CoachSchema = new mongoose.Schema(
  {
    name: { required: true, type: String },
    dateOfBirth: { required: true, type: String },
    nationality: { required: true, type: String },
    teams: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  }
);