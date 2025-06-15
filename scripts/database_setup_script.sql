-- ====================================================================
-- ENUM TYPES
-- ====================================================================

-- User related enums
CREATE TYPE user_role AS ENUM ('customer', 'admin', 'delivery_partner', 'restaurant_owner');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');

-- Restaurant related enums
CREATE TYPE restaurant_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE food_status AS ENUM ('available', 'unavailable', 'out_of_stock');

-- Order related enums
CREATE TYPE order_status AS ENUM (
    'pending', 'confirmed', 'preparing', 'ready_for_pickup', 
    'picked_up', 'delivered', 'cancelled', 'refunded'
);
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'upi', 'wallet');

-- Delivery related enums
CREATE TYPE vehicle_type AS ENUM ('bicycle', 'motorcycle', 'car');
CREATE TYPE availability_status AS ENUM ('available', 'busy', 'offline');

-- Coupon related enums
CREATE TYPE coupon_type AS ENUM ('percentage', 'fixed_amount', 'free_delivery');

-- Notification related enums
CREATE TYPE notification_type AS ENUM ('order_update', 'promotion', 'system');

-- ====================================================================
-- TABLES
-- ====================================================================

-- Users table (customers, admins, delivery partners, restaurant owners)
CREATE TABLE core_mstr_united_kart_users (
    core_mstr_united_kart_users_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role user_role NOT NULL,
    status user_status DEFAULT 'active',
    profile_image VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User addresses
CREATE TABLE core_mstr_united_kart_addresses (
    core_mstr_united_kart_addresses_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES core_mstr_united_kart_users(core_mstr_united_kart_users_id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL, -- Home, Office, etc.
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restaurants
CREATE TABLE core_mstr_united_kart_restaurants (
    core_mstr_united_kart_restaurants_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID REFERENCES core_mstr_united_kart_users(core_mstr_united_kart_users_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    image VARCHAR(500),
    cover_image VARCHAR(500),
    cuisine_type VARCHAR(100),
    avg_delivery_time INTEGER, -- in minutes
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    status restaurant_status DEFAULT 'active',
    is_open BOOLEAN DEFAULT TRUE,
    opening_time TIME,
    closing_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food categories
CREATE TABLE core_mstr_united_kart_categories (
    core_mstr_united_kart_categories_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food items
CREATE TABLE core_mstr_united_kart_food_items (
    core_mstr_united_kart_food_items_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID REFERENCES core_mstr_united_kart_restaurants(core_mstr_united_kart_restaurants_id) ON DELETE CASCADE,
    category_id UUID REFERENCES core_mstr_united_kart_categories(core_mstr_united_kart_categories_id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    discount_price DECIMAL(10, 2),
    image VARCHAR(500),
    is_veg BOOLEAN DEFAULT TRUE,
    ingredients TEXT,
    allergens TEXT,
    calories INTEGER,
    prep_time INTEGER, -- in minutes
    status food_status DEFAULT 'available',
    rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Food item variants (size, extras, etc.)
CREATE TABLE core_mstr_united_kart_food_variants (
    core_mstr_united_kart_food_variants_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    food_item_id UUID REFERENCES core_mstr_united_kart_food_items(core_mstr_united_kart_food_items_id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- Small, Medium, Large
    price_adjustment DECIMAL(10, 2) DEFAULT 0,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders
CREATE TABLE core_mstr_united_kart_orders (
    core_mstr_united_kart_orders_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES core_mstr_united_kart_users(core_mstr_united_kart_users_id),
    restaurant_id UUID REFERENCES core_mstr_united_kart_restaurants(core_mstr_united_kart_restaurants_id),
    delivery_partner_id UUID REFERENCES core_mstr_united_kart_users(core_mstr_united_kart_users_id),
    delivery_address_id UUID REFERENCES core_mstr_united_kart_addresses(core_mstr_united_kart_addresses_id),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    tax_amount DECIMAL(10, 2) DEFAULT 0,
    delivery_fee DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    payment_method payment_method,
    payment_status payment_status DEFAULT 'pending',
    payment_id VARCHAR(255), -- Payment gateway transaction ID
    order_status order_status DEFAULT 'pending',
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    special_instructions TEXT,
    cancellation_reason TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order items
CREATE TABLE core_mstr_united_kart_order_items (
    core_mstr_united_kart_order_items_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES core_mstr_united_kart_orders(core_mstr_united_kart_orders_id) ON DELETE CASCADE,
    food_item_id UUID REFERENCES core_mstr_united_kart_food_items(core_mstr_united_kart_food_items_id),
    variant_id UUID REFERENCES core_mstr_united_kart_food_variants(core_mstr_united_kart_food_variants_id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    special_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Delivery partner details
CREATE TABLE core_mstr_united_kart_delivery_partners (
    core_mstr_united_kart_delivery_partners_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES core_mstr_united_kart_users(core_mstr_united_kart_users_id) ON DELETE CASCADE,
    vehicle_type vehicle_type NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    license_number VARCHAR(50) NOT NULL,
    current_latitude DECIMAL(10, 8),
    current_longitude DECIMAL(11, 8),
    availability_status availability_status DEFAULT 'offline',
    rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    total_deliveries INTEGER DEFAULT 0,
    documents_json JSONB, -- Store document URLs
    is_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Order tracking
CREATE TABLE core_mstr_united_kart_order_tracking (
    core_mstr_united_kart_order_tracking_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES core_mstr_united_kart_orders(core_mstr_united_kart_orders_id) ON DELETE CASCADE,
    status order_status NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Coupons and discounts
CREATE TABLE core_mstr_united_kart_coupons (
    core_mstr_united_kart_coupons_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    coupon_type coupon_type NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    min_order_amount DECIMAL(10, 2) DEFAULT 0,
    max_discount_amount DECIMAL(10, 2),
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP NOT NULL,
    valid_until TIMESTAMP NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User coupon usage tracking
CREATE TABLE core_mstr_united_kart_user_coupon_usage (
    core_mstr_united_kart_user_coupon_usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES core_mstr_united_kart_users(core_mstr_united_kart_users_id),
    coupon_id UUID REFERENCES core_mstr_united_kart_coupons(core_mstr_united_kart_coupons_id),
    order_id UUID REFERENCES core_mstr_united_kart_orders(core_mstr_united_kart_orders_id),
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, coupon_id, order_id)
);

-- Reviews and ratings
CREATE TABLE core_mstr_united_kart_reviews (
    core_mstr_united_kart_reviews_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES core_mstr_united_kart_orders(core_mstr_united_kart_orders_id),
    customer_id UUID REFERENCES core_mstr_united_kart_users(core_mstr_united_kart_users_id),
    restaurant_id UUID REFERENCES core_mstr_united_kart_restaurants(core_mstr_united_kart_restaurants_id),
    delivery_partner_id UUID REFERENCES core_mstr_united_kart_users(core_mstr_united_kart_users_id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    review_type VARCHAR(20) NOT NULL, -- 'restaurant', 'delivery'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notifications
CREATE TABLE core_mstr_united_kart_notifications (
    core_mstr_united_kart_notifications_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES core_mstr_united_kart_users(core_mstr_united_kart_users_id),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type notification_type DEFAULT 'system',
    is_read BOOLEAN DEFAULT FALSE,
    data_json JSONB, -- Additional data
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================================================
-- INDEXES FOR PERFORMANCE OPTIMIZATION
-- ====================================================================

-- User table indexes
CREATE INDEX idx_core_mstr_united_kart_users_email ON core_mstr_united_kart_users(email);
CREATE INDEX idx_core_mstr_united_kart_users_phone ON core_mstr_united_kart_users(phone);
CREATE INDEX idx_core_mstr_united_kart_users_role ON core_mstr_united_kart_users(role);
CREATE INDEX idx_core_mstr_united_kart_users_status ON core_mstr_united_kart_users(status);

-- Address table indexes
CREATE INDEX idx_core_mstr_united_kart_addresses_user_id ON core_mstr_united_kart_addresses(user_id);
CREATE INDEX idx_core_mstr_united_kart_addresses_location ON core_mstr_united_kart_addresses(latitude, longitude);

-- Restaurant table indexes
CREATE INDEX idx_core_mstr_united_kart_restaurants_owner_id ON core_mstr_united_kart_restaurants(owner_id);
CREATE INDEX idx_core_mstr_united_kart_restaurants_location ON core_mstr_united_kart_restaurants(latitude, longitude);
CREATE INDEX idx_core_mstr_united_kart_restaurants_status ON core_mstr_united_kart_restaurants(status);
CREATE INDEX idx_core_mstr_united_kart_restaurants_cuisine ON core_mstr_united_kart_restaurants(cuisine_type);

-- Food items table indexes
CREATE INDEX idx_core_mstr_united_kart_food_items_restaurant ON core_mstr_united_kart_food_items(restaurant_id);
CREATE INDEX idx_core_mstr_united_kart_food_items_category ON core_mstr_united_kart_food_items(category_id);
CREATE INDEX idx_core_mstr_united_kart_food_items_status ON core_mstr_united_kart_food_items(status);

-- Order table indexes
CREATE INDEX idx_core_mstr_united_kart_orders_customer ON core_mstr_united_kart_orders(customer_id);
CREATE INDEX idx_core_mstr_united_kart_orders_restaurant ON core_mstr_united_kart_orders(restaurant_id);
CREATE INDEX idx_core_mstr_united_kart_orders_delivery_partner ON core_mstr_united_kart_orders(delivery_partner_id);
CREATE INDEX idx_core_mstr_united_kart_orders_status ON core_mstr_united_kart_orders(order_status);
CREATE INDEX idx_core_mstr_united_kart_orders_payment_status ON core_mstr_united_kart_orders(payment_status);
CREATE INDEX idx_core_mstr_united_kart_orders_created_at ON core_mstr_united_kart_orders(created_at);
CREATE INDEX idx_core_mstr_united_kart_orders_order_number ON core_mstr_united_kart_orders(order_number);

-- Order items table indexes
CREATE INDEX idx_core_mstr_united_kart_order_items_order_id ON core_mstr_united_kart_order_items(order_id);
CREATE INDEX idx_core_mstr_united_kart_order_items_food_item_id ON core_mstr_united_kart_order_items(food_item_id);

-- Delivery partners table indexes
CREATE INDEX idx_core_mstr_united_kart_delivery_partners_user_id ON core_mstr_united_kart_delivery_partners(user_id);
CREATE INDEX idx_core_mstr_united_kart_delivery_partners_availability ON core_mstr_united_kart_delivery_partners(availability_status);
CREATE INDEX idx_core_mstr_united_kart_delivery_partners_location ON core_mstr_united_kart_delivery_partners(current_latitude, current_longitude);

-- Order tracking table indexes
CREATE INDEX idx_core_mstr_united_kart_order_tracking_order ON core_mstr_united_kart_order_tracking(order_id);
CREATE INDEX idx_core_mstr_united_kart_order_tracking_status ON core_mstr_united_kart_order_tracking(status);

-- Coupon table indexes
CREATE INDEX idx_core_mstr_united_kart_coupons_code ON core_mstr_united_kart_coupons(code);
CREATE INDEX idx_core_mstr_united_kart_coupons_active ON core_mstr_united_kart_coupons(is_active);
CREATE INDEX idx_core_mstr_united_kart_coupons_validity ON core_mstr_united_kart_coupons(valid_from, valid_until);

-- User coupon usage table indexes
CREATE INDEX idx_core_mstr_united_kart_user_coupon_usage_user_id ON core_mstr_united_kart_user_coupon_usage(user_id);
CREATE INDEX idx_core_mstr_united_kart_user_coupon_usage_coupon_id ON core_mstr_united_kart_user_coupon_usage(coupon_id);

-- Reviews table indexes
CREATE INDEX idx_core_mstr_united_kart_reviews_order_id ON core_mstr_united_kart_reviews(order_id);
CREATE INDEX idx_core_mstr_united_kart_reviews_customer_id ON core_mstr_united_kart_reviews(customer_id);
CREATE INDEX idx_core_mstr_united_kart_reviews_restaurant_id ON core_mstr_united_kart_reviews(restaurant_id);
CREATE INDEX idx_core_mstr_united_kart_reviews_delivery_partner_id ON core_mstr_united_kart_reviews(delivery_partner_id);

-- Notifications table indexes
CREATE INDEX idx_core_mstr_united_kart_notifications_user_id ON core_mstr_united_kart_notifications(user_id);
CREATE INDEX idx_core_mstr_united_kart_notifications_read_status ON core_mstr_united_kart_notifications(is_read);
CREATE INDEX idx_core_mstr_united_kart_notifications_type ON core_mstr_united_kart_notifications(notification_type);

-- ====================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ====================================================================

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to tables with updated_at column
CREATE TRIGGER update_core_mstr_united_kart_users_updated_at
    BEFORE UPDATE ON core_mstr_united_kart_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_core_mstr_united_kart_restaurants_updated_at
    BEFORE UPDATE ON core_mstr_united_kart_restaurants
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_core_mstr_united_kart_food_items_updated_at
    BEFORE UPDATE ON core_mstr_united_kart_food_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_core_mstr_united_kart_orders_updated_at
    BEFORE UPDATE ON core_mstr_united_kart_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_core_mstr_united_kart_delivery_partners_updated_at
    BEFORE UPDATE ON core_mstr_united_kart_delivery_partners
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================================================================
-- SAMPLE DATA INSERTION (OPTIONAL)
-- ====================================================================

-- Insert sample categories
INSERT INTO core_mstr_united_kart_categories (name, description, is_active, sort_order) VALUES
('Appetizers', 'Starters and appetizers', TRUE, 1),
('Main Course', 'Main dishes and entrees', TRUE, 2),
('Desserts', 'Sweet treats and desserts', TRUE, 3),
('Beverages', 'Drinks and beverages', TRUE, 4),
('Fast Food', 'Quick and fast food items', TRUE, 5);

-- ====================================================================
-- COMPLETION MESSAGE
-- ====================================================================

-- Script execution completed successfully
SELECT 'United Kart database setup completed successfully!' as status;