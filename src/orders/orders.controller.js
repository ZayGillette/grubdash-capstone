const path = require("path");

// Use the existing order data
const orders = require(path.resolve("src/data/orders-data"));

// Use this function to assigh ID's when necessary
const nextId = require("../utils/nextId");

// TODO: Implement the /orders handlers needed to make the tests pass
function orderExists(req, res, next) {
  const { orderId } = req.params;
  const foundOrder = orders.find((order) => order.id === orderId);
  
  if (foundOrder) {
    res.locals.order = foundOrder;
    return next();
  }
  
  next({
    status: 404,
    message: `Order id not found: ${orderId}`,
  });
}

function validateOrderBody(req, res, next) {
  const { data: { deliverTo, mobileNumber, dishes } = {} } = req.body;

  if (!deliverTo || deliverTo === "") return next({ status: 400, message: "Order must include a deliverTo" });
  if (!mobileNumber || mobileNumber === "") return next({ status: 400, message: "Order must include a mobileNumber" });
  if (!dishes) return next({ status: 400, message: "Order must include a dish" });
  if (!Array.isArray(dishes) || dishes.length === 0) return next({ status: 400, message: "Order must include at least one dish" });

  // Validate the quantity of every dish in the array
  for (let i = 0; i < dishes.length; i++) {
    const quantity = dishes[i].quantity;
    if (quantity === undefined || quantity <= 0 || !Number.isInteger(quantity)) {
      return next({ 
        status: 400, 
        message: `Dish ${i} must have a quantity that is an integer greater than 0` 
      });
    }
  }

  next();
}

function validateStatus(req, res, next) {
  const { data: { status } = {} } = req.body;
  const validStatuses = ["pending", "preparing", "out-for-delivery", "delivered"];

  if (!status || status === "" || !validStatuses.includes(status)) {
    return next({ 
      status: 400, 
      message: "Order must have a status of pending, preparing, out-for-delivery, delivered" 
    });
  }

  if (res.locals.order.status === "delivered") {
    return next({ status: 400, message: "A delivered order cannot be changed" });
  }

  next();
}

function validateIdMismatch(req, res, next) {
  const { orderId } = req.params;
  const { data: { id } = {} } = req.body;

  // If ID is provided in the body, it must match the route param
  if (id && id !== "" && id !== orderId) {
    return next({ 
      status: 400, 
      message: `Order id does not match route id. Order: ${id}, Route: ${orderId}.` 
    });
  }
  
  next();
}

function validateDelete(req, res, next) {
  if (res.locals.order.status !== "pending") {
    return next({ 
      status: 400, 
      message: "An order cannot be deleted unless it is pending." 
    });
  }
  next();
}

// --- HANDLERS --- //

function list(req, res) {
  res.json({ data: orders });
}

function create(req, res) {
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;
  
  const newOrder = {
    id: nextId(),
    deliverTo,
    mobileNumber,
    status: status ? status : "pending",
    dishes,
  };
  
  orders.push(newOrder);
  res.status(201).json({ data: newOrder });
}

function read(req, res) {
  res.json({ data: res.locals.order });
}

function update(req, res) {
  const order = res.locals.order;
  const { data: { deliverTo, mobileNumber, status, dishes } = {} } = req.body;

  order.deliverTo = deliverTo;
  order.mobileNumber = mobileNumber;
  order.status = status;
  order.dishes = dishes;

  res.json({ data: order });
}

function destroy(req, res) {
  const index = orders.findIndex((order) => order.id === res.locals.order.id);
  // Splice removes the item directly from the array
  orders.splice(index, 1); 
  res.sendStatus(204);
}

module.exports = {
  list,
  create: [validateOrderBody, create],
  read: [orderExists, read],
  update: [orderExists, validateOrderBody, validateIdMismatch, validateStatus, update],
  destroy: [orderExists, validateDelete, destroy],
};