import User, { PERMISSIONS, addPermissionsToUser } from "./models/user.js";
import Event from "./models/event.js";
import Logger from "./models/actionlog.js";

/**
*
* WILL DELETE ENTIRE DB ON EVERY LOAD!!!!!!!!!!!!!!
*
* Only use when in DEVELOPMENT mode. 
* 
* @author Alexander Beck
*/
export async function testDB() {
    /* eslint-disable no-unused-vars */
    await User.deleteMany({});
    await Event.deleteMany({});
    await Logger.deleteMany({});
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
        // TODO: This might be causing an inconsistent error, keep an eye on it
        await addPermissionsToUser(user, true, PERMISSIONS.CREATE_EVENT, PERMISSIONS.INVITE_TO_ALL_EVENTS, PERMISSIONS.MODIFY_USERS);

        user.addPermissionsToOtherUser(user2, PERMISSIONS.INVITE_TO_ALL_EVENTS);

        const christmasPartySchema = {
            name: 'Christmas Party',
            date: new Date(2024, 11, 25),
            location: 'Unity 520',
            guestLimit: 3
        };

        const christmasParty = await user.createEvent(christmasPartySchema);

        // Will be either christmasParty.invite(inviter, user) or user.inviteUsers(christmasParty, users).
        // Let me know which would make more sense.
        // await christmasParty.attendees.addToSet(
        //     { guest: user2, inviter: user },
        //     { guest: user3, inviter: user },
        //     );
        // await christmasParty.save();

        await user.inviteUsers(christmasParty, user2, user3, user4)

    } catch (err) {
        console.log(err);
    }


}