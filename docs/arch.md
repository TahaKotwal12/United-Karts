# Complete Food Delivery App Creation Prompt

## Project Overview
Create a comprehensive food delivery application with three user roles: **Customers**, **Restaurant Owners/Admins**, and **Delivery Partners**. The app should support 2,000-3,000 initial users and be scalable for future growth.

## Technology Stack Requirements

### Backend
- **Framework**: Python FastAPI with async support
- **Database**: PostgreSQL as primary database
- **Caching**: Redis for session management and caching
- **Authentication**: JWT token-based authentication
- **Real-time**: Socket.io for live order tracking
- **File Storage**: AWS S3 or local file storage
- **Task Queue**: Celery with Redis broker
- **Payment Integration**: Razorpay for Indian market (or Stripe for international)

### Frontend (Mobile App)
- **Framework**: React Native with TypeScript
- **State Management**: Redux Toolkit with RTK Query
- **Navigation**: React Navigation v6
- **Maps**: react-native-maps with Google Maps API
- **Real-time**: Socket.io client
- **UI Library**: React Native Elements + React Native Paper
- **HTTP Client**: Axios with interceptors

## Database Schema Requirements

Create a PostgreSQL database with the following tables and relationships:

### Core Tables
1. **users** - Multi-role users (customer, admin, delivery_partner, restaurant_owner)
2. **addresses** - User delivery addresses with geolocation
3. **restaurants** - Restaurant information with location and business details
4. **categories** - Food categories for menu organization
5. **food_items** - Menu items with pricing and availability
6. **food_variants** - Size/customization options for food items
7. **orders** - Complete order management with status tracking
8. **order_items** - Individual items within orders
9. **delivery_partners** - Delivery personnel details and vehicle info
10. **order_tracking** - Real-time location tracking for orders
11. **coupons** - Discount and promotional codes
12. **user_coupon_usage** - Track coupon usage per user
13. **reviews** - Rating and review system
14. **notifications** - Push notification management

### Required Enums
- user_role, user_status, restaurant_status, food_status
- order_status, payment_status, payment_method
- vehicle_type, availability_status, coupon_type, notification_type

### Indexing Strategy
Implement proper indexes for performance on frequently queried columns like user emails, restaurant locations, order statuses, and timestamps.

## Backend API Structure

### Authentication Endpoints
```
POST /api/v1/auth/register - User registration
POST /api/v1/auth/login - User login
POST /api/v1/auth/refresh - Token refresh
POST /api/v1/auth/logout - User logout
POST /api/v1/auth/forgot-password - Password reset request
POST /api/v1/auth/reset-password - Password reset confirmation
```

### User Management
```
GET /api/v1/users/profile - Get user profile
PUT /api/v1/users/profile - Update profile
GET /api/v1/users/addresses - Get user addresses
POST /api/v1/users/addresses - Add new address
PUT /api/v1/users/addresses/{id} - Update address
DELETE /api/v1/users/addresses/{id} - Delete address
```

### Restaurant & Menu
```
GET /api/v1/restaurants - List restaurants with filters
GET /api/v1/restaurants/{id} - Restaurant details
GET /api/v1/restaurants/{id}/menu - Restaurant menu
GET /api/v1/restaurants/search - Search restaurants
GET /api/v1/restaurants/nearby - Nearby restaurants by location
GET /api/v1/categories - Food categories
```

### Order Management
```
POST /api/v1/orders - Create new order
GET /api/v1/orders - Get user orders
GET /api/v1/orders/{id} - Order details
PUT /api/v1/orders/{id}/cancel - Cancel order
GET /api/v1/orders/{id}/tracking - Real-time order tracking
POST /api/v1/orders/{id}/review - Submit order review
```

### Delivery Partner APIs
```
GET /api/v1/delivery/orders/available - Available orders for pickup
POST /api/v1/delivery/orders/{id}/accept - Accept delivery order
PUT /api/v1/delivery/orders/{id}/status - Update order status
PUT /api/v1/delivery/location - Update current location
GET /api/v1/delivery/earnings - Delivery earnings report
GET /api/v1/delivery/history - Delivery history
```

### Admin/Restaurant Owner APIs
```
GET /api/v1/admin/dashboard - Dashboard analytics
GET /api/v1/admin/orders - Manage orders
PUT /api/v1/admin/orders/{id}/status - Update order status
GET /api/v1/admin/menu - Manage menu items
POST /api/v1/admin/menu/items - Add menu item
PUT /api/v1/admin/menu/items/{id} - Update menu item
DELETE /api/v1/admin/menu/items/{id} - Delete menu item
```

### Payment & Coupons
```
POST /api/v1/payments/create - Create payment intent
POST /api/v1/payments/verify - Verify payment
GET /api/v1/coupons/validate/{code} - Validate coupon code
GET /api/v1/coupons/available - Available coupons for user
```

## React Native App Structure

### App Architecture
Create a feature-based folder structure with the following main sections:

#### Core Features
1. **Authentication Flow**
   - Login/Register screens with form validation
   - OTP verification for phone numbers
   - Password reset functionality
   - Role-based navigation after login

2. **Customer App Features**
   - Home screen with restaurant listings and search
   - Location-based restaurant discovery
   - Restaurant details with menu browsing
   - Cart management with item customization
   - Checkout with address selection and payment
   - Order tracking with real-time location updates
   - Order history and reordering functionality
   - Profile management and address book
   - Rating and review system

3. **Delivery Partner App Features**
   - Available orders dashboard
   - Order acceptance and management
   - GPS navigation to pickup/delivery locations
   - Real-time location sharing
   - Earnings tracking and history
   - Profile and vehicle information management

4. **Restaurant Owner/Admin Features**
   - Order management dashboard
   - Menu item management (add/edit/delete)
   - Order status updates
   - Analytics and reporting
   - Restaurant profile settings

### Required React Native Packages
```json
{
  "dependencies": {
    "@react-navigation/native": "^6.1.9",
    "@react-navigation/stack": "^6.3.20",
    "@react-navigation/bottom-tabs": "^6.5.11",
    "@reduxjs/toolkit": "^1.9.7",
    "react-redux": "^8.1.3",
    "axios": "^1.6.2",
    "react-native-maps": "^1.8.3",
    "@react-native-community/geolocation": "^3.1.0",
    "socket.io-client": "^4.7.4",
    "@react-native-async-storage/async-storage": "^1.19.5",
    "react-native-keychain": "^8.1.3",
    "react-native-elements": "^3.4.3",
    "react-native-paper": "^5.11.3",
    "react-native-vector-icons": "^10.0.2",
    "react-native-image-picker": "^7.0.3",
    "react-native-razorpay": "^2.3.0",
    "@react-native-firebase/messaging": "^18.6.2",
    "react-native-permissions": "^4.0.2",
    "react-hook-form": "^7.48.2",
    "yup": "^1.4.0"
  }
}
```

## Key Features to Implement

### 1. Real-time Features
- Live order tracking with delivery partner location
- Real-time order status updates
- Push notifications for order updates
- Socket.io integration for instant updates

### 2. Location Services
- GPS-based restaurant discovery
- Accurate delivery address selection
- Delivery partner location tracking
- Distance calculation for delivery fees

### 3. Payment Integration
- Multiple payment options (Card, UPI, Wallet, COD)
- Secure payment processing
- Payment verification and failure handling
- Refund management

### 4. Rating & Review System
- Order rating and reviews
- Restaurant rating aggregation
- Delivery partner ratings
- Review moderation

### 5. Admin Dashboard
- Order management and analytics
- Restaurant performance metrics
- Delivery partner management
- User management and support

### 6. Push Notifications
- Order status updates
- Promotional notifications
- Delivery partner notifications
- Admin alerts

## Security Requirements

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- Secure password hashing (bcrypt)
- Session management with refresh tokens

### Data Security
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting for API endpoints
- HTTPS enforcement

### Payment Security
- PCI DSS compliance considerations
- Secure payment token handling
- Payment verification
- Fraud detection basics

## Performance Requirements

### Backend Optimization
- Database connection pooling
- Redis caching for frequently accessed data
- Async request handling
- Database query optimization with proper indexing
- API response compression

### Mobile App Optimization
- Efficient list rendering with FlatList
- Image optimization and caching
- Bundle size optimization
- Memory management
- Offline functionality for basic features

## Deployment Strategy

### Backend Deployment
- Containerized deployment with Docker
- Cloud deployment (AWS/GCP/Azure)
- Environment-based configuration
- Database migration strategy
- Monitoring and logging setup

### Mobile App Deployment
- Android Play Store deployment
- iOS App Store deployment (if required)
- Code signing and certificate management
- OTA updates with CodePush
- Crash reporting with Firebase Crashlytics

## Testing Requirements

### Backend Testing
- Unit tests for business logic
- Integration tests for API endpoints
- Database testing with test fixtures
- Authentication and authorization testing

### Mobile App Testing
- Component testing with React Native Testing Library
- Integration testing for user flows
- E2E testing with Detox
- Performance testing

## Documentation Requirements

### Technical Documentation
- API documentation with Swagger/OpenAPI
- Database schema documentation
- Architecture documentation
- Deployment guides

### User Documentation
- User manual for each app role
- FAQ and troubleshooting guide
- Admin panel usage guide
- Developer setup instructions

## Success Metrics

### Performance Metrics
- App load time < 3 seconds
- API response time < 500ms for 95% of requests
- Support for 2000-3000 concurrent users
- 99.9% uptime target

### Business Metrics
- User registration and retention rates
- Order completion rates
- Average delivery time
- Customer satisfaction scores
- Revenue tracking

## Development Timeline

### Phase 1 (Weeks 1-2): Foundation
- Database setup and schema creation
- Basic FastAPI structure and authentication
- React Native project setup with navigation

### Phase 2 (Weeks 3-4): Core Features
- Restaurant and menu management APIs
- Order management system
- Basic mobile app screens (auth, home, restaurants)

### Phase 3 (Weeks 5-6): Advanced Features
- Payment integration
- Real-time tracking with Socket.io
- Cart and checkout functionality
- Delivery partner features

### Phase 4 (Weeks 7-8): Integration & Polish
- End-to-end testing
- Admin dashboard
- Push notifications
- Performance optimization

### Phase 5 (Weeks 9-10): Deployment & Launch
- Production deployment
- App store submission
- Documentation completion
- Launch preparation

## Deliverables Expected

1. **Complete Backend API** with all endpoints functional
2. **Three React Native Apps** (Customer, Delivery Partner, Admin/Restaurant)
3. **PostgreSQL Database** with all tables and relationships
4. **API Documentation** with Swagger
5. **Deployment Scripts** for cloud deployment
6. **Testing Suite** for both backend and frontend
7. **User Documentation** and setup guides

Create this food delivery application following industry best practices, ensuring scalability, security, and excellent user experience across all three user roles.