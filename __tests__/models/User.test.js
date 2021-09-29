const mongoose = require('mongoose');

const User = require('../../server/models/User');

let db;
beforeAll(async () => {
  db = await mongoose.connect('mongodb://localhost/paw-test');
});
beforeEach(async () => {
  await User.deleteMany({});
});
afterAll(async () => {
  await db.disconnect();
})

const user1 = {
  name: "Miguel Hernandez",
  first_name: "Miguel",
  last_name: "Hernandez",
  email: 'miguelh72@outlook.com',
  facebook_id: '4283744385006083',
  picture_fb: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=4283744385006083&height=100&width=100&ext=1635463572&hash=AeTfY7SinoOq6UiQAB8',
  last_login_IP: '127.0.0.1',
  last_login_time: new Date(),
};
const user2 = {
  name: "Another Hernandez",
  first_name: "Another",
  last_name: "Hernandez",
  email: 'another@outlook.com',
  facebook_id: '4354359845065645',
  picture_fb: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=4354359845065645&height=100&width=100&ext=1635463572&hash=AeTfY7SinoOq6UiQAB8',
  last_login_IP: '127.0.0.1',
  last_login_time: new Date(),
};

describe('Test creating and updating User in DB', () => {
  test('Create multiple users to the db', async () => {
    let result = await User.create(user1);
    expect(result).toMatchObject(user1);

    result = await User.create(user2);
    expect(result).toMatchObject(user2);

    result = await User.find({});
    expect(result).toHaveLength(2);
    expect(result).toMatchObject([user1, user2]);

    // creating user with repeat facebook_id should fail
    const repeat_facebook_id_user = {
      ...user1,
      name: "Yet another Hernandez",
      first_name: "Yet",
      last_name: "Another",
      email: 'yet@outlook.com',
      picture_fb: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=5456453456456&height=100&width=100&ext=1635463572&hash=AeTfY7SinoOq6UiQAB8',
      last_login_IP: '127.0.0.1',
      last_login_time: new Date(),
    };
    try {
      await User.create(repeat_facebook_id_user);
      throw 'This should not create user with repeated facebook_id.';
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
    }
  })

  test('Update user in the db', async () => {
    let result = await User.create(user1);
    expect(result).toMatchObject(user1);

    const updatedUser1 = { ...user1, name: 'Mikael Hernan' };
    expect(updatedUser1).not.toMatchObject(user1);
    await User.updateOne(updatedUser1);
    result = await User.findOne({ facebook_id: updatedUser1.facebook_id });
    expect(result).toMatchObject(updatedUser1);
  });
});
