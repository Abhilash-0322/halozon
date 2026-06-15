import mongoose from 'mongoose';

const AnswerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    body: { type: String, required: true },
    helpful: { type: Number, default: 0 },
    isSeller: { type: Boolean, default: false },
    isAsker: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const QuestionSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    body: { type: String, required: true },
    helpful: { type: Number, default: 0 },
    answers: [AnswerSchema],
    answerCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model('Question', QuestionSchema);
