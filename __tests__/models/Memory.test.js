const mongoose = require('mongoose');

const Memory = require('../../server/models/Memory');

let db;
beforeAll(async () => {
  db = await mongoose.connect('mongodb://localhost/paw-test');
});
beforeEach(async () => {
  await Memory.deleteMany({});
})
afterAll(async () => {
  await db.disconnect();
})

describe('Test creating and updating Memory in DB', () => {
  const memory1 = {
    user_id: '4354359845065645',
    context: {
      restaurant_name: 'Thai House',
      restaurant_address: '163th Street, Miami, FL',
      user_tags: [{ user_id: '4354359845065645' }],
      date: new Date('March 19, 2019'),
    },
    country_name: 'Thailand',
    rating: 4.5,
  };
  const memory2 = {
    user_id: '4354359845065645',
    context: {
      restaurant_name: 'McDonalds',
      restaurant_address: '125th Street, Miami, FL',
      user_tags: [],
      date: new Date('May 22, 2020'),
    },
    country_name: 'United States',
    rating: 2,
  };

  test('Create multiple memory to the DB', async () => {
    let result = await Memory.create(memory1);
    expect(result).toMatchObject(memory1);

    result = await Memory.create(memory2);
    expect(result).toMatchObject(memory2);

    result = await Memory.find({});
    expect(result).toHaveLength(2);
    expect(result).toMatchObject([memory1, memory2]);
  });

  test('Memory middleware corrects rating errors', async () => {
    // round down
    let memory = { ...memory1, rating: 1.2 };
    let result = await Memory.create(memory);
    expect(result).toMatchObject({ ...memory, rating: 1.0 });

    // round up
    memory = { ...memory1, rating: 1.8 };
    result = await Memory.create(memory);
    expect(result).toMatchObject({ ...memory, rating: 2.0 });

    // dont allow numbers below 0
    memory = { ...memory1, rating: -3 };
    result = await Memory.create(memory);
    expect(result).toMatchObject({ ...memory, rating: 0 });

    // dont allow numbers above 5
    memory = { ...memory1, rating: 10 };
    result = await Memory.create(memory);
    expect(result).toMatchObject({ ...memory, rating: 5 });
  });

  test('Update memory in the DB', async () => {
    const mem1_id = (await Memory.create(memory1))._id.toString();

    const updatedMemory = {
      ...memory1,
      rating: 3,
      context: {
        ...memory1.context,
        date: new Date(),
      }
    }
    expect(updatedMemory).not.toMatchObject(memory1);

    await Memory.updateOne(updatedMemory);
    const result = await Memory.findOne({ _id: mongoose.Types.ObjectId(mem1_id) });
    expect(result).toMatchObject(updatedMemory);
  });

  test('Delete memories in the DB', async () => {
    const mem1_id = (await Memory.create(memory1))._id.toString();
    const mem2_id = (await Memory.create(memory2))._id.toString();

    let result = await Memory.find({});
    expect(result).toMatchObject([memory1, memory2]);

    result = await Memory.deleteOne({ _id: mongoose.Types.ObjectId(mem1_id) });
    expect(result).toMatchObject({ deletedCount: 1 });

    result = await Memory.find({});
    expect(result).toMatchObject([memory2]);

    result = await Memory.deleteOne({ _id: mongoose.Types.ObjectId(mem2_id) });
    expect(result).toMatchObject({ deletedCount: 1 });

    result = await Memory.find({});
    expect(result).toHaveLength(0);
  });
});
