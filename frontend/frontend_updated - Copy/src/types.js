/**
 * @typedef {Object} MenuItem
 * @property {number} id
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {string} category
 * @property {string} image
 */

/**
 * @typedef {MenuItem & {quantity: number}} OrderItem
 */

/**
 * @typedef {Object} Order
 * @property {number} id
 * @property {OrderItem[]} items
 * @property {number} total
 * @property {'pending' | 'preparing' | 'ready' | 'completed' | 'rejected'} status
 * @property {'pending' | 'completed'} paymentStatus
 * @property {Date} timestamp
 * @property {number} [tableNumber]
 */

/**
 * @typedef {Object} Message
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} message
 * @property {Date} timestamp
 * @property {boolean} read
 * @property {Date} [bookingDate]
 * @property {string} [bookingTime]
 * @property {number} [tableNumber]
 * @property {number} [numberOfPeople]
 * @property {boolean} isBooking
 * @property {'pending' | 'accepted' | 'rejected'} [status]
 */

/**
 * @typedef {Object} Rating
 * @property {number} id
 * @property {string} name
 * @property {string} message
 * @property {number} stars
 * @property {Date} timestamp
 */

export {};