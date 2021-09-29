const Memory = require('../models/Memory');
const User = require('../models/User');

const { isValidCountry } = require('./../utils/countryUtils');

/**
  * Middleware: Load public memory info from DB. If successful, memory front-end schema object will be set in `res.locals.memory`.
  */
async function getClientMemoryObject(req, res, next) {
  const { memory_id } = req.params;
  if (!memory_id.match(/^[0-9a-z]*$/i)) return next({
    status: 400,
    response: { error: 'Memory ID must be a alphanumerical.' }
  })

  try {
    const memoryResult = await Memory.findById(memory_id);
    if (!memoryResult) return next();

    // grab memory owner user info
    const owner = await User.findOne({ faceboon_id: memoryResult.user_id });
    if (!owner) {
      // user no longer exists, maintain referential integrity and delete old memory
      await Memory.findByIdAndDelete(memory_id);
      return next();
    }

    // below is front-end schema
    res.locals.memory = {
      memory_id: memoryResult._id.toString(),
      owner_name: owner.name,
      owner_id: memoryResult.user_id,
      result: memoryResult.user_id,
      context: memoryResult.context,
      country_name: memoryResult.country_name,
      rating: memoryResult.rating,
    }

    // STRETCH load user info for tagged users. Delete any tags to user's that no longer exist. 

  } catch (err) {
    if (err.message.match(/ObjectId/i)) return next({
      status: 400,
      response: { error: 'Memory ID must be a valid memory ID. ID does not match schema.' }
    })
    return next(err);
  }

  return next();
}

/**
 * Middleware: Load an array of front-end schema memories for the country in params. If successful, array will be set in `res.locals.memoryArray`, sorted in reverse chronological order.
 */
async function getClientMemoryArrayForCountry(req, res, next) {
  if (!res.locals.session) return next();

  const { country_name } = req.params;
  if (!isValidCountry(country_name)) return next({
    status: 400,
    response: { error: 'Not a valid country name.' }
  })

  try {
    const memories = await Memory.find({
      user_id: res.locals.session.facebook_id,
      country_name: new RegExp(country_name, 'i'),
    }).sort({ 'context.date': -1 });

    res.locals.memoryArray = memories.map(dbMemory => {
      // below is front-end schema
      return {
        memory_id: dbMemory._id.toString(),
        owner_name: res.locals.session.name,
        owner_id: dbMemory.user_id,
        result: dbMemory.user_id,
        context: dbMemory.context,
        country_name: dbMemory.country_name,
        rating: dbMemory.rating,
      }
    });
    // STRETCH load user info for tagged users. Delete any tags to user's that no longer exist. 
  } catch (err) {
    return next(err);
  }

  return next();
}

/**
 * Middleware: Load every memory for a user. If successful, `res.locals.countriesObj` will be set to an object with keys being country_name and values being an array of front-end schema memory objects, sorted in reverse chronological order.
 */
async function getClientCountriesObject(req, res, next) {
  if (!res.locals.session) return next();

  try {
    // STRETCH implement pagination to limit number of memories returned until user asks to view more 
    const allMemories = await Memory.find({
      user_id: res.locals.session.facebook_id,
    }).sort({ 'country_name': 1, 'context.date': -1 });

    res.locals.countriesObj = allMemories.reduce((countriesObj, memory) => {
      // below is front-end schema
      const memoryObj = {
        memory_id: memory._id.toString(),
        owner_name: res.locals.session.name,
        owner_id: memory.user_id,
        result: memory.user_id,
        context: memory.context,
        country_name: memory.country_name,
        rating: memory.rating,
      };

      countriesObj[memory.country_name] = countriesObj[memory.country_name] ?? [];
      countriesObj[memory.country_name].push(memoryObj);
      return countriesObj;
    }, Object.create(null));
    // STRETCH load user info for tagged users. Delete any tags to user's that no longer exist. 
  } catch (err) {
    return next(err);
  }

  return next();
}

/**
 * Middleware: Store memory to DB. If successful, `res.locals.memory` will contain a memory front-end schema.
 */
async function storeMemory(req, res, next) {
  if (!res.locals.session) return next();

  // validate user input
  // STRETCH add ability to receive user tags 

  let { context, country_name, rating = 5 } = req.body;
  rating = +rating;
  if (isNaN(rating)) return next({
    status: 400,
    response: { error: 'Rating is not a valid number between 0 and 5.' },
  });
  if (!isValidCountry(country_name)) return next({
    status: 400,
    response: { error: 'Invalid country name.' },
  });
  if (!context) return next({
    status: 400,
    response: { error: 'Invalid memory context.' },
  });

  let { restaurant_name, restaurant_address = '', date } = context;
  if (!restaurant_name) return next({
    status: 400,
    response: { error: 'You must provide a restaurant name.' },
  });
  if (date && isNaN(Date.parse(date))) return next({
    status: 400,
    response: { error: 'Invalid date format.' },
  });
  date = date ? new Date(date) : new Date;

  // Store memory in DB
  try {
    const memoryResult = await Memory.create({
      user_id: res.locals.session.facebook_id,
      context: {
        restaurant_name,
        restaurant_address,
        user_tags: [],
        date
      },
      country_name,
      rating: round(rating, 0.5)
    });

    // below is front-end schema
    res.locals.memory = {
      memory_id: memoryResult._id.toString(),
      owner_name: res.locals.session.name,
      owner_id: memoryResult.user_id,
      result: memoryResult.user_id,
      context: memoryResult.context,
      country_name: memoryResult.country_name,
      rating: memoryResult.rating,
    }
  } catch (err) {
    return next(err);
  }

  return next();
}

/**
 * Middleware: Update memory in DB. If successful, `res.locals.memory` will contain a memory front-end schema.
 */
async function updateMemory(req, res, next) {
  if (!res.locals.session) return next();

  const { memory_id } = req.params;
  if (!memory_id.match(/^[0-9a-z]*$/i)) return next({
    status: 400,
    response: { error: 'Memory ID must be a alphanumerical.' }
  })

  // validate user input
  // STRETCH add ability to update user tags 

  let { context = {}, country_name, rating } = req.body;
  if (rating) rating = +rating;
  if (rating && isNaN(rating)) return next({
    status: 400,
    response: { error: 'Rating is not a valid number between 0 and 5.' },
  });
  if (country_name && !isValidCountry(country_name)) return next({
    status: 400,
    response: { error: 'Invalid country name.' },
  });
  let { restaurant_name, restaurant_address, date } = context;
  if (date && isNaN(Date.parse(date))) return next({
    status: 400,
    response: { error: 'Invalid date format.' },
  });
  if (date) date = new Date(date);

  // update memory
  try {
    let memoryResult = await Memory.findById(memory_id);
    if (!memoryResult) return next();

    const updateObj = { ...memoryResult._doc };
    if (country_name) updateObj.country_name = country_name;
    if (rating) updateObj.rating = round(rating, 0.5);
    if (restaurant_name) updateObj.context.restaurant_name = restaurant_name;
    if (restaurant_address) updateObj.context.restaurant_address = restaurant_address;
    if (date) updateObj.context.date = date;

    memoryResult = await Memory.findByIdAndUpdate(memory_id, updateObj, { new: true });

    // below is front-end schema
    res.locals.memory = {
      memory_id: memoryResult._id.toString(),
      owner_name: res.locals.session.name,
      owner_id: memoryResult.user_id,
      result: memoryResult.user_id,
      context: memoryResult.context,
      country_name: memoryResult.country_name,
      rating: memoryResult.rating,
    }
  } catch (err) {
    if (err.message.match(/ObjectId/i)) return next({
      status: 400,
      response: { error: 'Memory ID must be a valid memory ID. ID does not match schema.' }
    })
    return next(err);
  }

  return next();
}

/**
 * Middleware: Delete memory in DB. If successful, `res.locals.success` will be true.
 */
async function deleteMemory(req, res, next) {
  if (!res.locals.session) return next();

  const { memory_id } = req.params;
  if (!memory_id.match(/^[0-9a-z]*$/i)) return next({
    status: 400,
    response: { error: 'Memory ID must be a alphanumerical.' }
  })

  // delete memory
  try {
    await Memory.findByIdAndDelete(memory_id);
    res.locals.success = true;
  } catch (err) {
    if (err.message.match(/ObjectId/i)) return next({
      status: 400,
      response: { error: 'Memory ID must be a valid memory ID. ID does not match schema.' }
    })
    return next(err);
  }

  return next();
}

// TODO refactor rounding functionality from here to mongoose middleware 
function round(value, step) {
  step || (step = 1.0);
  const inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

module.exports = {
  getClientMemoryObject,
  getClientMemoryArrayForCountry,
  getClientCountriesObject,
  storeMemory,
  updateMemory,
  deleteMemory
};
