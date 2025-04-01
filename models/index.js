const User = require('./user');
const Event = require('./event');
const Category = require('./category');
const UserCategory = require('./userCategory');
const EventCategory = require('./eventCategory');   
const FavouriteEvent = require('./favouriteEvent');


// user preferences (user <-> category)
User.belongsToMany(Category, { through: UserCategory, as: 'preferences' });
//User.belongsToMany(Event, { through: 'UserFavoriteEvents', as: 'favorites', foreignKey: 'userId' });
Category.belongsToMany(User, { through: UserCategory, as: 'users' });

// Event Categories (Event <-> Category)
Event.belongsToMany(Category, { through: EventCategory, as: 'categories' });
//Event.belongsToMany(User, { through: 'UserFavoriteEvents', as: 'favoritedBy', foreignKey: 'eventId' });
Category.belongsToMany(Event, { through: EventCategory, as: 'events' });

// Favorite Events (User <-> Event)
User.belongsToMany(Event, { through: FavouriteEvent, as: 'favorites', foreignKey: 'userId', otherKey: 'eventId' });
Event.belongsToMany(User, { through: FavouriteEvent, as: 'favoritedBy', foreignKey: 'eventId', otherKey: 'userId' });


module.exports = {
    User,
    Event,
    Category,
    UserCategory,
    EventCategory,
    FavouriteEvent
};