import mongoose, { Schema, model, models } from 'mongoose';

// Define the Schema for the Problem model
const ProblemSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters long'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters long']
  },
  codes: {
    java: {
      type: String,
      default: ''
    },
    c: {
      type: String,
      default: ''
    },
    cpp: {
      type: String,
      default: ''
    },
    js: {
      type: String,
      default: ''
    }
  },
  tags: {
    type: [String],
    default: []
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Author is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
ProblemSchema.index({ title: 'text', description: 'text' });
ProblemSchema.index({ tags: 1 });
ProblemSchema.index({ createdAt: -1 });

const Problem = models.Problem || model('Problem', ProblemSchema);

export default Problem;