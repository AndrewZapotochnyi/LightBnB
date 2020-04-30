const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});




const properties = require('./json/properties.json');
const users = require('./json/users.json');

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  // let user;
  // for (const userId in users) {
  //   user = users[userId];
  //   if (user.email.toLowerCase() === email.toLowerCase()) {
  //     break;
  //   } else {
  //     user = null;
  //   }
  // }
  // return Promise.resolve(user);

  // console.log("hello");

  return pool.query(`
  SELECT *
  FROM users
  WHERE email = $1;`, [email])
   .then(res => {
    // console.log(res.rows);

    if (res.rows.length < 1) {
      
      // console.log("null")
      return null;
      
    } else {
      
      return res.rows[0];

    }

    
  } );



}
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  // return Promise.resolve(users[id]);

  return pool.query(`
  SELECT *
  FROM users
  WHERE id = $1;`, [id])
   .then(res => {
    // console.log(res.rows);

    if (res.rows.length < 1) {  
      // console.log("null")
      return null;   
    } else {      
      return res.rows[0];
    }
  } );
}
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser =  function(user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;

  // console.log(user.name, user.email, user.password);
  // return Promise.resolve(user);

  return pool.query(`
  INSERT INTO users (
    name, email, password) 
    VALUES (
    $1, $2, $3)
    RETURNING *;`, [user.name, user.email, user.password])
   .then(res => {
    // console.log(res.rows);
    console.log(res);
    if (res.rows.length < 1) {  
      // console.log("null")
      return null;   
    } else {      
      return res.rows[0];
    }
  } );

}
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  // return getAllProperties(null, 2);

  const allReservationsQuery = `SELECT properties.*, reservations.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id 
  WHERE reservations.guest_id = $1
  AND reservations.end_date < now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`

  return pool.query(allReservationsQuery, [guest_id, limit])
   .then(res => {
    // console.log(res.rows);
    // console.log(res);
    if (res.rows.length < 1) {  
      // console.log("null")
      return null;   
    } else {      
      console.log(res.rows);
      return res.rows;
    }
  } );


}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  `;

  let andBoolean = false;

  // 3
  if (options.city) {
    queryParams.push(`${options.city}`);
    queryString += `WHERE city LIKE $${queryParams.length} `;
    andBoolean = true;
  }

  if (options.owner_id) {
    if (andBoolean === true) {
      queryParams.push(`%${options.owner_id}%`);
      queryString += `AND properties.owner_id = $${queryParams.length} `;
    } else {
      queryParams.push(`%${options.owner_id}%`);
      queryString += `WHERE properties.owner_id = $${queryParams.length} `;
      andBoolean = true;
    }
  }

  if (options.minimum_price_per_night) {
    if (andBoolean === true) {
      queryParams.push(`${options.minimum_price_per_night}`);
      queryString += `AND properties.cost_per_night > $${queryParams.length} `;
    } else {
      queryParams.push(`${options.minimum_price_per_night}`);
      queryString += `WHERE properties.cost_per_night > $${queryParams.length} `;
      andBoolean = true;
    }


    
  }

  if (options.maximum_price_per_night) {
    if (andBoolean === true) {
      queryParams.push(`${options.maximum_price_per_night}`);
      queryString += `AND properties.cost_per_night < $${queryParams.length} `;
    } else {
      queryParams.push(`${options.maximum_price_per_night}`);
      queryString += `WHERE properties.cost_per_night < $${queryParams.length} `;
      andBoolean = true;
    }
    
  }

  


  // 4
  
  
  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryParams.push(limit);

  
    queryString += `GROUP BY properties.id
    HAVING avg(property_reviews.rating) > $${queryParams.length-1} 
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;


  } else {
    queryParams.push(limit);
    queryString += `
    GROUP BY properties.id
    ORDER BY cost_per_night
    LIMIT $${queryParams.length};
    `;
  }

  

  // 5
  console.log(queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams)
  .then(res => res.rows);
}
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  // return Promise.resolve(property);

  console.log(property);

  let queryParams = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];
  console.log(queryParams);


  let addPropertyQuery = `INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, street, city, province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`


  console.log(queryParams, addPropertyQuery);

  return pool.query(addPropertyQuery, queryParams)
  .then(res => res.rows);





}
exports.addProperty = addProperty;
