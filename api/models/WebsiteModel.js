'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var WebsiteSchema = new Schema({
    title: {
        type: String,
        required: 'enter the name of the website'
    },
    userId: {
        type: String,
        required: true
    },
    pages: {
        type: [{
            pageTitle: {
                type: String,
                required: 'Enter the name of the page'
            },
            createdDate: {
                type: Date,
                default: Date.now
            },
            pageOrder: {
                type: Number,
                required: true
            },
            pageVisible:{
                type: Boolean,
                default:true
            },
            posts: {
                type: [{
                    postTitle: {
                        type: String,
                        required: 'Enter a posttitle'
                    },
                    postText: {
                        type: String,
                        required: 'Enter text'
                    },
                    postPhotos: {
                        type: [{
                            type: String
                        }]
                    },
                    postType: {
                        type: String,
                        enum: ['noPhoto', 'singlePhoto', 'multiplePhotos']
                        // ,
                        // required: 'Choose the postType'
                    },
                    postDate: {
                        type: Date,
                        default: Date.now
                    },
                    postOrder: {
                        type: Number
                        // ,
                        // required: true
                    },
                    postVisible:{
                        type: Boolean,
                        default:true
                    }
                }]
            }
        }]
    }
});

module.exports = mongoose.model('Website', WebsiteSchema);