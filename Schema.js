const Joi=require("joi");

module.exports.listingSchema=Joi.object({
  listing:Joi.object({
    title:Joi.string().max(100).required(),
    description:Joi.string().required(),
    'image.url':Joi.string().allow("",null),
    price:Joi.number().required(),
    location:Joi.string().max(50).required(),
    country:Joi.string().max(50).required()
  }).required()
});

module.exports.reviewSchema=Joi.object({
  review:Joi.object({
    rating:Joi.number().required().min(1).max(5),
    comment:Joi.string().required()
  }).required()
})