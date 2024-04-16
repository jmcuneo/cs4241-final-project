import User, { PERMISSIONS } from "./models/user";
import Event from "./models/event";

export async function testDB() {
    /* eslint-disable no-unused-vars */
    await User.deleteMany({});
    await Event.deleteMany({});
    const user = await User.create({
        firstName: 'Alexander',
        lastName: 'Beck',
        gender: 'Male',
        username: 'abeck'
    });
    const user2 = await User.create({
        firstName: 'Jane',
        lastName: 'Doe',
        gender: 'Female',
        username: 'jdoe'
    });
    const user3 = await User.create({
        firstName: 'John',
        lastName: 'Smith',
        gender: 'Male',
        username: 'jsmith'
    });
    const user4 = await User.create({
        firstName: 'ale',
        lastName: 'asdf',
        gender: 'Female',
        username: 'AHHHHHH'
    });

    try {
        user.permissions.addToSet(PERMISSIONS.CREATE_EVENT, PERMISSIONS.INVITE_TO_ALL_EVENTS);
        await user.save();

        const christmasParty = await Event.create({
            name: 'Christmas Party',
            date: new Date(2024, 11, 25),
            location: 'Unity 520',
            creator: user,
            guestLimit: 3
        });

        christmasParty.attendees.addToSet(
            { guest: user2, inviter: user },
            { guest: user3, inviter: user },
            { guest: user4, inviter: user });
        await christmasParty.save();

    } catch (err) {
        console.log(err.errors);
    }


}