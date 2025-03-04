const mongoose = require ('mongoose')
const type = require('mongoose/lib/schema/operators/type')
const marked = require('marked')
const slugify = require('slugify')
// html in nodejs
const createDomPurify = require('dompurify')
const { JSDOM } = require('jsdom')
const dompurify = createDomPurify(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    markdown: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    slug:{
        type: String,
        required: true,
        unique: true
    },
})


articleSchema.pre('validate', function(next) {
    if (this.title){
        this.slug = slugify(this.title, {lower: true, strict: true})
    }
    next()
})

module.exports = mongoose.model('Article', articleSchema)