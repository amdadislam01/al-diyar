import mongoose, { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
    {
        title: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        content: { type: String, required: true },
        excerpt: { type: String },
        coverImage: { type: String },
        author: {
            name: { type: String, required: true },
            image: { type: String },
            id: { type: Schema.Types.ObjectId, ref: "User" }
        },
        category: { type: String, default: "Uncategorized" },
        tags: [{ type: String }],
        status: { type: String, enum: ["draft", "published"], default: "draft" },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Blog = models.Blog || model("Blog", BlogSchema);
export default Blog;
