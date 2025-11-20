# PawFam Backend API

## Project Overview

**PawFam** is a comprehensive pet care platform that connects pet owners with essential services including pet adoption, daycare facilities, and pet accessories. The backend is built as a RESTful API using Node.js and Express, with MongoDB as the database, providing robust user authentication, role-based access control, and comprehensive service management.

### Key Features
- Dual user roles (Customer & Vendor)
- Pet adoption application system
- Daycare center booking management
- Pet accessories e-commerce
- User and vendor profile management
- Secure JWT-based authentication
- OTP-based password recovery
- Email notification system

---

## Tech Stack

### Backend Framework
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### Authentication & Security
- **JWT (jsonwebtoken)** - Token-based authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Email Services
- **Nodemailer** - Email delivery
- **Ethereal Email** - Email testing (development)
- Support for Gmail and Outlook

### Development Tools
- **dotenv** - Environment variable management

---

## Project Structure

```
pawfam-backend/
├── config/
│   └── database.js              # MongoDB connection configuration
├── middleware/
│   └── auth.js                  # JWT authentication middleware
├── models/
│   ├── AccessoryProduct.js      # Pet accessories product schema
│   ├── AdoptionApplication.js   # Adoption application schema
│   ├── AdoptionPet.js          # Adoptable pets schema
│   ├── DaycareBooking.js       # Daycare booking schema
│   ├── DaycareCenter.js        # Daycare facility schema
│   ├── Pet.js                  # User's personal pets schema
│   ├── ProductOrder.js         # Product orders schema
│   ├── User.js                 # User authentication schema
│   ├── UserProfile.js          # Customer profile schema
│   ├── VendorProfile.js        # Vendor profile schema
│   └── Vendor.js               # Vendor business details schema
├── routes/
│   ├── auth.js                 # Authentication routes
│   ├── profile.js              # Customer profile routes
│   ├── vendorProfile.js        # Vendor profile routes
│   ├── pets.js                 # Personal pet management routes
│   ├── daycare.js              # Daycare booking routes (customer)
│   ├── products.js             # Product order routes (customer)
│   ├── adoption.js             # Adoption application routes
│   ├── vendorDaycare.js        # Daycare management routes (vendor)
│   ├── vendorAccessories.js    # Product management routes (vendor)
│   └── vendorAdoption.js       # Adoption pet management routes (vendor)
├── services/
│   └── emailService.js         # Email notification service
├── server.js                   # Application entry point
└── .env                        # Environment variables
```

---

## Modules & Functionality

### 1. Authentication Module (`routes/auth.js`)

**Purpose**: Handles user registration, login, and password recovery

**Endpoints**:
- `POST /api/auth/register` - Customer registration
- `POST /api/auth/vendor/register` - Vendor registration
- `POST /api/auth/login` - Customer login
- `POST /api/auth/vendor/login` - Vendor login
- `POST /api/auth/send-reset-otp` - Send password reset OTP
- `POST /api/auth/verify-reset-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user info

**MongoDB Queries Used**:
```javascript
// Find user by email
User.findOne({ email: email.toLowerCase() })

// Create new user
new User({ username, email, password, role }).save()

// Generate JWT token with user data
jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET)

// Update password and clear OTP
user.password = newPassword
user.resetPasswordOTP = undefined
user.save()
```

---

### 2. Profile Management Module (`routes/profile.js`, `routes/vendorProfile.js`)

**Purpose**: Manages customer and vendor profile information

**Customer Endpoints** (`/api/profile`):
- `GET /` - Get user profile
- `POST /` - Create user profile
- `PUT /` - Update user profile
- `DELETE /` - Delete user profile

**Vendor Endpoints** (`/api/vendor-profile`):
- `GET /` - Get vendor profile
- `POST /` - Create vendor profile with auto-generated vendor ID
- `PUT /` - Update vendor profile
- `DELETE /` - Delete vendor profile

**MongoDB Queries Used**:
```javascript
// Find profile by user ID
UserProfile.findOne({ userId: req.user._id })
VendorProfile.findOne({ userId: req.user._id })

// Create profile
new UserProfile({ userId, name, gender, mobileNumber, residentialAddress }).save()

// Update profile
UserProfile.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true })

// Generate unique vendor ID
VendorProfile.countDocuments()
const vendorId = `VEN${String(count + 1).padStart(6, '0')}`
```

---

### 3. Pet Management Module (`routes/pets.js`)

**Purpose**: Allows customers to manage their personal pets

**Endpoints**:
- `GET /api/pets` - Get all user's pets
- `GET /api/pets/:id` - Get single pet
- `POST /api/pets` - Add new pet
- `PUT /api/pets/:id` - Update pet information
- `DELETE /api/pets/:id` - Delete pet
- `GET /api/pets/breeds/:category` - Get breed options for Dog/Cat

**MongoDB Queries Used**:
```javascript
// Get all pets for user
Pet.find({ userId: req.user._id }).sort({ createdAt: -1 })

// Get single pet owned by user
Pet.findOne({ _id: petId, userId: req.user._id })

// Create new pet
new Pet({ userId, category, breed, name, age }).save()

// Update pet
Pet.findOneAndUpdate({ _id: petId, userId }, updateData, { new: true })

// Delete pet
Pet.findOneAndDelete({ _id: petId, userId })
```

---

### 4. Adoption Module (`routes/adoption.js`, `routes/vendorAdoption.js`)

**Purpose**: Manages pet adoption listings and applications

**Customer Endpoints** (`/api/adoption`):
- `POST /applications` - Submit adoption application
- `GET /applications` - Get user's applications
- `GET /applications/:id` - Get single application
- `PUT /applications/:id` - Update application
- `PATCH /applications/:id/revoke` - Cancel application
- `DELETE /applications/:id` - Delete application

**Vendor Endpoints** (`/api/vendor/adoption`):
- `GET /pets` - Get all available pets (public)
- `GET /my-pets` - Get vendor's pets
- `POST /pets` - Add pet for adoption
- `PUT /pets/:id` - Update pet details
- `DELETE /pets/:id` - Remove pet listing
- `GET /applications` - Get applications for vendor's pets

**MongoDB Queries Used**:
```javascript
// Submit adoption application
new AdoptionApplication({ 
  user, pet, personalInfo, experience, 
  visitSchedule, adoptionReason 
}).save()

// Get user applications
AdoptionApplication.find({ user: userId }).sort({ createdAt: -1 })

// Get vendor's adoptable pets
AdoptionPet.find({ vendor: vendorId, isActive: true })

// Get applications for vendor's pets
const petIds = await AdoptionPet.find({ vendor: vendorId }).select('_id')
AdoptionApplication.find({ 'pet.id': { $in: petIds } })

// Update application status
AdoptionApplication.findOneAndUpdate({ _id, user }, { status }, { new: true })
```

---

### 5. Daycare Module (`routes/daycare.js`, `routes/vendorDaycare.js`)

**Purpose**: Manages daycare center listings and bookings

**Customer Endpoints** (`/api/daycare`):
- `POST /bookings` - Create daycare booking
- `GET /bookings` - Get user bookings (with search)
- `GET /bookings/:id` - Get single booking
- `PUT /bookings/:id` - Update booking details
- `PATCH /bookings/:id/cancel` - Cancel booking
- `DELETE /bookings/:id` - Delete booking

**Vendor Endpoints** (`/api/vendor/daycare`):
- `GET /centers` - Get all daycare centers (public)
- `GET /my-centers` - Get vendor's centers
- `POST /centers` - Create daycare center
- `PUT /centers/:id` - Update center details
- `DELETE /centers/:id` - Delete center
- `GET /bookings` - Get bookings for vendor's centers

**MongoDB Queries Used**:
```javascript
// Create booking with center reference
new DaycareBooking({
  user, daycareCenter, daycareCenterId, vendor,
  petName, petType, startDate, endDate, totalAmount
}).save()

// Search bookings
const searchRegex = new RegExp(search, 'i')
DaycareBooking.find({ 
  user: userId,
  $or: [
    { petName: searchRegex },
    { 'daycareCenter.name': searchRegex }
  ]
})

// Get vendor's centers
DaycareCenter.find({ vendor: vendorId, isActive: true })

// Get bookings for vendor's centers
const centerIds = await DaycareCenter.find({ vendor: vendorId }).select('_id')
DaycareBooking.find({ 
  $or: [
    { vendor: vendorId },
    { daycareCenterId: { $in: centerIds } }
  ]
})
```

---

### 6. Products & Orders Module (`routes/products.js`, `routes/vendorAccessories.js`)

**Purpose**: E-commerce functionality for pet accessories

**Customer Endpoints** (`/api/products`):
- `POST /orders` - Place product order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get single order
- `PUT /orders/:id/address` - Update shipping address
- `PATCH /orders/:id/cancel` - Cancel order
- `DELETE /orders/:id` - Delete order

**Vendor Endpoints** (`/api/vendor/accessories`):
- `GET /products` - Get all products (public)
- `GET /my-products` - Get vendor's products
- `POST /products` - Add new product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product
- `GET /orders` - Get orders containing vendor's products

**MongoDB Queries Used**:
```javascript
// Create order with vendor enrichment
const product = await AccessoryProduct.findById(productId).lean()
const enrichedItems = items.map(item => ({
  ...item,
  vendor: product?.vendor
}))
new ProductOrder({ user, items: enrichedItems, shippingAddress, totalAmount }).save()

// Get user orders
ProductOrder.find({ user: userId }).sort({ createdAt: -1 })

// Get vendor's products
AccessoryProduct.find({ vendor: vendorId })
  .populate('vendor', 'username email')

// Get orders for vendor's products
const myProductIds = await AccessoryProduct.find({ vendor: vendorId }).select('_id')
ProductOrder.find({ 
  $or: [
    { 'items.vendor': vendorId },
    { 'items.productId': { $in: myProductIds } }
  ]
})

// Update order status
ProductOrder.findByIdAndUpdate(orderId, { status }, { new: true })
```

---

## MongoDB Schema Designs

### User Schema
```javascript
{
  username: String (unique, 3-30 chars),
  email: String (unique, lowercase),
  password: String (hashed, min 6 chars),
  role: String (enum: ['customer', 'vendor']),
  resetPasswordOTP: String,
  resetPasswordOTPExpires: Date,
  timestamps: true
}
```

### AdoptionApplication Schema
```javascript
{
  user: ObjectId (ref: User),
  pet: {
    id: String,
    name: String,
    type: String,
    breed: String,
    age: String,
    shelter: String
  },
  personalInfo: {
    fullName: String,
    email: String,
    phone: String,
    address: String
  },
  experience: {
    level: String,
    details: String,
    otherPets: String,
    otherPetsDetails: String
  },
  visitSchedule: {
    date: Date,
    time: String
  },
  adoptionReason: String,
  status: String (enum: ['pending', 'under_review', 'approved', 'rejected', 'scheduled']),
  timestamps: true
}
```

### DaycareBooking Schema
```javascript
{
  user: ObjectId (ref: User),
  daycareCenterId: ObjectId (ref: DaycareCenter),
  vendor: ObjectId (ref: User),
  daycareCenter: {
    name: String,
    location: String,
    pricePerDay: Number
  },
  petName: String,
  petType: String,
  petAge: String,
  email: String,
  mobileNumber: String,
  startDate: Date,
  endDate: Date,
  specialInstructions: String,
  totalAmount: Number,
  status: String (enum: ['pending', 'confirmed', 'cancelled', 'completed']),
  timestamps: true
}
```

### ProductOrder Schema
```javascript
{
  user: ObjectId (ref: User),
  items: [{
    productId: String,
    name: String,
    price: Number,
    quantity: Number,
    image: String,
    vendor: ObjectId (ref: User)
  }],
  shippingAddress: {
    fullName: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zipCode: String (6 digits)
  },
  paymentInfo: {
    cardNumber: String (masked),
    expiryDate: String,
    cvv: String (masked)
  },
  totalAmount: Number,
  status: String (enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
  timestamps: true
}
```

---

## Use Cases

### Customer User Flow

1. **Registration & Profile Setup**
   - Register as customer
   - Create profile with personal details
   - Add personal pets to the system

2. **Pet Adoption**
   - Browse available pets for adoption
   - Submit adoption application with personal info, experience, and visit schedule
   - Track application status
   - Edit or cancel applications before approval

3. **Daycare Services**
   - Search daycare centers by location
   - Book daycare for pets with date range
   - View and manage bookings
   - Cancel bookings if needed

4. **Shopping for Pet Accessories**
   - Browse pet products by category
   - Add items to cart and place orders
   - Update shipping address before shipment
   - Track order status
   - Cancel orders before processing

### Vendor User Flow

1. **Vendor Registration & Setup**
   - Register as vendor
   - Create vendor profile with business details
   - Receive unique vendor ID

2. **Daycare Center Management**
   - Add daycare center listings with facilities, pricing, and images
   - Update operating hours and capacity
   - View and manage bookings from customers
   - Update booking status

3. **Adoption Services**
   - List pets available for adoption
   - Update pet health status and temperament
   - View adoption applications
   - Manage application status

4. **Product Sales**
   - Add pet accessories to catalog
   - Manage inventory and pricing
   - View orders containing their products
   - Update product availability

---

## API Authentication Flow

### JWT Token Generation
```javascript
// On successful login/registration
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
)
```

### Protected Route Access
```javascript
// Middleware extracts and verifies token
const token = req.header('Authorization')?.replace('Bearer ', '')
const decoded = jwt.verify(token, process.env.JWT_SECRET)
const user = await User.findById(decoded.userId).select('-password')
req.user = user
```

### Role-Based Access Control
```javascript
// Vendor-only routes
if (req.user.role !== 'vendor') {
  return res.status(403).json({ message: 'Access denied. Vendor role required.' })
}
```

---

### UML Diagram

**Component Diagram**
<img width="940" height="1209" alt="image" src="https://github.com/user-attachments/assets/aa58eac0-1558-4dc2-8acb-e79bc98e422f" />

**Order Sequence (When Customer Places Order)**
<img width="940" height="940" alt="image" src="https://github.com/user-attachments/assets/be7c87e4-8de4-419b-8a11-d61e77e093b2" />

**Class Diagram**
<img width="940" height="1175" alt="image" src="https://github.com/user-attachments/assets/5d6c92c5-a8e3-4146-8406-85ada29e3ad5" />

**Vendor Daycare Management (Sequence Diagram)**
<img width="940" height="705" alt="image" src="https://github.com/user-attachments/assets/c2e52851-856d-4b3d-b476-a4aab6712626" />

**System Diagram**
<img width="940" height="1097" alt="image" src="https://github.com/user-attachments/assets/cc8ea668-bdb8-40e5-aad8-698b0ee81644" />

**Customer Daycare Booking (Sequence Diagram)**
<img width="940" height="823" alt="image" src="https://github.com/user-attachments/assets/bca253c7-6e04-4f31-b8e0-4018cfdf5e11" />

**Deployment Diagram**
<img width="940" height="529" alt="image" src="https://github.com/user-attachments/assets/7143ede3-814b-41fa-8c12-7abf8cb1379d" />

**Activity Diagram**
<img width="940" height="1315" alt="image" src="https://github.com/user-attachments/assets/f50c7271-6d78-4749-8887-1ec4089aad0a" />

### OTP Email Flow
1. User requests password reset
2. Generate 6-digit alphanumeric OTP
3. Store OTP with 10-minute expiry
4. Send formatted email with OTP
5. User verifies OTP
6. User sets new password
7. Send confirmation email

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd pawfam-backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env
# Edit .env with your configuration
```

4. **Start MongoDB**
```bash
# Using MongoDB service
sudo service mongod start

```

5. **Run the application**
```bash
# Development mode
npm run dev

```

---

## Database Indexes

Performance optimization through strategic indexing:

```javascript
// User authentication
UserSchema.index({ email: 1 })
UserSchema.index({ username: 1 })

// Profile lookups
UserProfileSchema.index({ userId: 1 })
VendorProfileSchema.index({ userId: 1 })
VendorProfileSchema.index({ vendorId: 1 })

// Pet queries
PetSchema.index({ userId: 1 })

// Adoption searches
AdoptionPetSchema.index({ vendor: 1 })
AdoptionPetSchema.index({ type: 1, status: 1 })
AdoptionPetSchema.index({ isActive: 1 })

// Daycare searches
DaycareCenterSchema.index({ vendor: 1 })
DaycareCenterSchema.index({ city: 1, state: 1 })
DaycareCenterSchema.index({ isActive: 1 })

// Product searches
AccessoryProductSchema.index({ vendor: 1 })
AccessoryProductSchema.index({ category: 1, petType: 1 })
AccessoryProductSchema.index({ isActive: 1 })
```

---

## Security Features

### Password Security
- Bcrypt hashing with salt rounds (10)
- Automatic hashing on user creation
- Password comparison method for authentication

### Token Security
- JWT tokens with 7-day expiry
- Token verification middleware
- Role-based access control

### Data Validation
- Input sanitization
- Email format validation
- Phone number format validation (10 digits)
- ZIP code validation (6 digits)
- Mongoose schema validation

### Sensitive Data Protection
- Password excluded from query results
- CVV masked in payment info
- Card numbers partially hidden

---

## Error Handling

### Validation Errors
```javascript
if (error.name === 'ValidationError') {
  return res.status(400).json({ message: error.message })
}
```

### Duplicate Key Errors
```javascript
if (error.code === 11000) {
  const field = Object.keys(error.keyPattern)[0]
  return res.status(400).json({ message: `${field} already exists` })
}
```

### Authentication Errors
```javascript
if (!token) {
  return res.status(401).json({ message: 'No token, authorization denied' })
}
```

### Authorization Errors
```javascript
if (req.user.role !== 'vendor') {
  return res.status(403).json({ message: 'Access denied' })
}
```

---

## Future Enhancements

### Planned Features
1. **Payment Integration**: Stripe/PayPal for actual payments
2. **Image Upload**: AWS S3 or Cloudinary integration
3. **Real-time Notifications**: WebSocket for instant updates
4. **Review System**: Ratings and reviews for vendors
5. **Advanced Search**: Elasticsearch integration
6. **Analytics Dashboard**: Vendor performance metrics
7. **Admin Panel**: System-wide management interface
8. **Geolocation**: Distance-based daycare searches
9. **Chat System**: Buyer-vendor messaging
10. **Mobile App**: React Native frontend

### Technical Improvements
- Redis caching for frequently accessed data
- Rate limiting for API endpoints
- Request logging and monitoring
- API documentation with Swagger
- Unit and integration tests
- CI/CD pipeline setup
- Docker containerization
- Load balancing for scalability

---

## References

### Documentation
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Documentation](https://jwt.io/)
- [Nodemailer Documentation](https://nodemailer.com/)

### Tutorials & Resources
- [MongoDB Schema Design Patterns](https://www.mongodb.com/blog/post/6-rules-of-thumb-for-mongodb-schema-design)

### Libraries Used
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `jsonwebtoken` - JWT implementation
- `bcryptjs` - Password hashing
- `nodemailer` - Email service with multi-provider support
- `cors` - CORS middleware
- `dotenv` - Environment configuration

---

## Conclusion

PawFam Backend is a comprehensive, production-ready API that demonstrates modern web development practices including:

**Robust Architecture**: Modular design with clear separation of concerns  
**Security First**: JWT authentication, password hashing, role-based access  
**Scalable Design**: MongoDB indexing, efficient queries, optimized schemas  
**User Experience**: Email notifications, OTP verification, detailed error messages  
**Vendor Support**: Complete business management capabilities  
**Code Quality**: Consistent patterns, error handling, validation

The platform successfully bridges the gap between pet owners and service providers, offering a seamless experience for adoption, daycare, and shopping needs. With its extensible architecture and well-documented codebase, PawFam is positioned for future growth and feature additions.

### Key Achievements
- Secure dual-role authentication system
- Comprehensive CRUD operations across all modules
- Advanced search and filtering capabilities
- Professional multi-provider email notification system with branded templates
- Scalable MongoDB schema design
- Complete API documentation
- Production-ready security measures
- Consistent PawFam branding across all communications

**PawFam**: Connecting pets with love and care, one API call at a time! 🐾

---

## Contact & Support

For questions, issues, or contributions:
- Email: dhiraajph@gmail.com
- LinkedIn: [DHIRAAJ K V](https://www.linkedin.com/in/dhiraajkv)

---

**Maintained By**: PawFam Development Team
