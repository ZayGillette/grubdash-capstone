# GrubDash Backend Capstone

## Project Overview
This project is a backend API built for GrubDash. The API handles complete CRUD (Create, Read, Update, Delete) operations for `dishes` and `orders`. This project involved debugging an existing codebase, implementing complex validation logic, and ensuring API reliability.

## Design Decisions & Architecture
To maintain a clean and scalable codebase, I prioritized modularity by separating the routing logic from the request handling. 
Middleware Separation - Instead of placing validation logic directly inside the route handlers, I created middleware functions like `validateDishBody`, `validateOrderBody` and `validateStatus` to keep the handlers focused solely on executing the core operation and returning the response.
Data Passing - I utilized `res.locals` to pass verified data, like a found dish or order, from the middleware to the handlers, preventing redundant database lookups.
Immutable IDs - The update handlers are strictly designed to prevent the overwriting of a resource's `id` property, ensuring data integrity.

## Debugging Approach & Error Handling
A good portion of this project involved making sure the API handles invalid requests and edge cases.
GET /orders - Ensured the route properly connects to the controller to retrieve and return the full array of order data without dropping requests.
POST /orders & PUT /orders - I implemented robust error handling to manage failed API calls. If a user attempts to submit an order with missing fields (like `deliverTo` or `mobileNumber`), the middleware catches this and returns a `400 Bad Request` with a specific error message.
Array Validation - The most complex debugging involved the `dishes` array within an order. The `validateOrderBody` middleware iterates through the array to confirm that every single dish has a valid integer `quantity` greater than zero before allowing the request to proceed.
State Management - Added specific validation to prevent updates to orders that have a status of `delivered`, and restricted the `DELETE` method so that only `pending` orders can be removed.

## Process Log

1. Initial Setup - Reviewed the starter code, data structures, and the Qualified assessment requirements.
2. Dishes API Core - Implemented the `GET`, `POST`, `PUT`, and `GET (by ID)` routes and handlers for the dishes resource.
3. Dishes Validation - Built and attached the middleware to validate dish properties and ID matching.
4. Orders API Core - Developed the CRUD routes and handlers for the orders resource, including the `DELETE` method.
5. Orders Validation - Implemented the complex middleware required to validate order statuses and iterate through the nested dishes array.
6. Final Testing - Ran the testing suite, debugged the remaining array validation errors, and finalized the codebase.

## Authenticity & Individual Contribution
I completed this project by reviewing previous modules and Qualified assessments to make sure I was implementing everything correctly.

## AI Tools Disclosure
I was able to complete this project by using the code from previous lessons as a reference instead of AI.
