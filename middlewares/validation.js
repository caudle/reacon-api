import joi from '@hapi/joi';

// validate register
export const validateRegister = (data) => {
  const schema = joi.object({
    phone: joi.string().min(10),
    email: joi.string().email(),
    name: joi.string().min(2),
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// validate login
export const validateLogin = (data) => {
    const schema = joi.object({
      email: joi.string().email().required(),
      password: joi.string().min(6).required(),
    });
    return schema.validate(data);
  };
//validate phone
export const validatePhone = (data) => {
  const schema = joi.object({
    phone: joi.string().min(12),
  });
  return schema.validate(data);
};

// validate pass
export const validateChangePass = (data) => {
  const schema = joi.object({
    password: joi.string().min(6).required(),
  });
  return schema.validate(data);
};

// validate listing
export const validateListing = (data) => {
  const schema = joi.object({
    name: joi.string().required(),
    category: joi.string().required(),
    nature: joi.string().required(),
    hostId: joi.string().required(),
    baths: joi.number().optional(),
    beds:  joi.number().optional(),
    size:  joi.number().required(),
    address: joi.string().required(),
    amenities: joi.array().required(),
    furnished: joi.boolean().optional(),
    pets: joi.boolean().optional(),
    photos: joi.optional(),
    price: joi.number().required(),
    negotiable: joi.boolean().optional(),
    description: joi.string().required(),
    dalaliFee: joi.number().required(),
    duration:  joi.string().required(),
  });
  return schema.validate(data);
};

//validate listing
export const validateLand = (data) => {
  const schema = joi.object({
    title: joi.string().required(),
    category: joi.string().required(),
    nature: joi.string().required(),
    hostId: joi.string().required(),
    size:  joi.number().required(),
    address: joi.string().required(),
    photos: joi.optional(),
    price: joi.number().required(),
    negotiable: joi.boolean().optional(),
    description: joi.string().required(),
    dalaliFee: joi.number().required(),
  });
  return schema.validate(data);
};

//validate venue
export const validateVenue = (data) => {
  const schema = joi.object({
    title: joi.string().required(),
    category: joi.string().required(),
    nature: joi.string().required(),
    hostId: joi.string().required(),
    capacity:  joi.number().required(),
    address: joi.string().required(),
    photos: joi.optional(),
    price: joi.number().required(),
    negotiable: joi.boolean().optional(),
    description: joi.string().required(),
    duration: joi.string().required(),
    dalaliFee: joi.number().required(),
  });
  return schema.validate(data);
};

