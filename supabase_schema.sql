-- Wickart Marketplace Supabase Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Settings Table
CREATE TABLE IF NOT EXISTS platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    support_email VARCHAR(255),
    contact_number VARCHAR(50),
    header_address TEXT,
    company_name VARCHAR(255),
    logo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Home Page Sections Config
CREATE TABLE IF NOT EXISTS homepage_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_custom_sections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255),
    left_banner_url TEXT,
    right_banner_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS homepage_sliders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Coupons
CREATE TABLE IF NOT EXISTS coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_type VARCHAR(50) CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_order_amount DECIMAL(10,2) DEFAULT 0,
    max_usage_per_user INT DEFAULT 1,
    valid_until TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    target_audience VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Stores / Vendors
CREATE TABLE IF NOT EXISTS stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    contact_phone VARCHAR(50),
    store_url TEXT,
    description TEXT,
    logo_url TEXT,
    global_commission DECIMAL(5,2),
    deliverable_zipcode_type VARCHAR(50),
    kyc_status VARCHAR(50) DEFAULT 'pending',
    subscription_plan VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    tax_name VARCHAR(100),
    tax_number VARCHAR(100),
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    low_stock_limit INT,
    require_product_approval BOOLEAN DEFAULT true,
    view_customer_details BOOLEAN DEFAULT false,
    seo_title VARCHAR(255),
    seo_keywords TEXT,
    seo_description TEXT,
    seo_og_image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Sellers (Users managing stores)
CREATE TABLE IF NOT EXISTS sellers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    address TEXT,
    authorized_signature_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Customers
CREATE TABLE IF NOT EXISTS customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    mobile VARCHAR(50) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    dob DATE,
    gender VARCHAR(50),
    referral_code VARCHAR(100),
    referred_by VARCHAR(100), -- referral code used
    wallet_balance DECIMAL(10,2) DEFAULT 0,
    receive_offers BOOLEAN DEFAULT true,
    receive_emails BOOLEAN DEFAULT true,
    receive_sms BOOLEAN DEFAULT true,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS customer_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    house_no VARCHAR(100),
    street VARCHAR(255),
    landmark VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Referral Settings
CREATE TABLE IF NOT EXISTS referral_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reward_referrer DECIMAL(10,2) DEFAULT 200,
    reward_referee DECIMAL(10,2) DEFAULT 200,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Brands
CREATE TABLE IF NOT EXISTS brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Variant Types and Values
CREATE TABLE IF NOT EXISTS variant_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL, -- e.g., 'Cloth Size', 'Color', 'Weight'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS variant_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_type_id UUID REFERENCES variant_types(id) ON DELETE CASCADE,
    value_label VARCHAR(255) NOT NULL, -- e.g., 'XXL', '100g'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Categories & Subcategories
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subcategories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    image_url TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Reasons for Return
CREATE TABLE IF NOT EXISTS reasons_for_return (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reason_text TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Return Requests
CREATE TABLE IF NOT EXISTS return_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    req_id VARCHAR(50) UNIQUE NOT NULL,
    order_id VARCHAR(100) NOT NULL,
    customer_id UUID REFERENCES customers(id),
    reason_id UUID REFERENCES reasons_for_return(id),
    status VARCHAR(50) DEFAULT 'pending_approval', -- 'pending_approval', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Dispatch / Fleet
CREATE TABLE IF NOT EXISTS delivery_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'active', -- 'active', 'inactive'
    current_lat DECIMAL(10,8),
    current_lng DECIMAL(11,8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS dispatch_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id VARCHAR(100) NOT NULL,
    delivery_partner_id UUID REFERENCES delivery_partners(id),
    status VARCHAR(50) DEFAULT 'unassigned', -- 'unassigned', 'in_transit', 'delivered'
    assigned_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 14. POS Orders
CREATE TABLE IF NOT EXISTS pos_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_mobile VARCHAR(50),
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_payable DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50), -- 'cash', 'card', 'upi'
    status VARCHAR(50) DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 15. Vendor Registrations (Approvals)
CREATE TABLE IF NOT EXISTS vendor_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reg_id VARCHAR(50) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- ==========================================
-- Enable Row Level Security (RLS)
-- ==========================================
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_custom_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE sellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE reasons_for_return ENABLE ROW LEVEL SECURITY;
ALTER TABLE return_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatch_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE pos_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_registrations ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- Basic RLS Policies (Development Mode)
-- ==========================================
-- Note: These policies currently allow public access for demonstration and development. 
-- In a production environment, you should restrict these using auth.uid() or specific roles.

DROP POLICY IF EXISTS "Enable read access for all users" ON platform_settings;
CREATE POLICY "Enable read access for all users" ON platform_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON platform_settings;
CREATE POLICY "Enable insert for authenticated users only" ON platform_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON platform_settings;
CREATE POLICY "Enable update for authenticated users only" ON platform_settings FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON platform_settings;
CREATE POLICY "Enable delete for authenticated users only" ON platform_settings FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON homepage_categories;
CREATE POLICY "Enable read access for all users" ON homepage_categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON homepage_categories;
CREATE POLICY "Enable insert for authenticated users only" ON homepage_categories FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON homepage_categories;
CREATE POLICY "Enable update for authenticated users only" ON homepage_categories FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON homepage_categories;
CREATE POLICY "Enable delete for authenticated users only" ON homepage_categories FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON homepage_custom_sections;
CREATE POLICY "Enable read access for all users" ON homepage_custom_sections FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON homepage_custom_sections;
CREATE POLICY "Enable insert for authenticated users only" ON homepage_custom_sections FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON homepage_custom_sections;
CREATE POLICY "Enable update for authenticated users only" ON homepage_custom_sections FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON homepage_custom_sections;
CREATE POLICY "Enable delete for authenticated users only" ON homepage_custom_sections FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON homepage_sliders;
CREATE POLICY "Enable read access for all users" ON homepage_sliders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON homepage_sliders;
CREATE POLICY "Enable insert for authenticated users only" ON homepage_sliders FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON homepage_sliders;
CREATE POLICY "Enable update for authenticated users only" ON homepage_sliders FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON homepage_sliders;
CREATE POLICY "Enable delete for authenticated users only" ON homepage_sliders FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON coupons;
CREATE POLICY "Enable read access for all users" ON coupons FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON coupons;
CREATE POLICY "Enable insert for authenticated users only" ON coupons FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON coupons;
CREATE POLICY "Enable update for authenticated users only" ON coupons FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON coupons;
CREATE POLICY "Enable delete for authenticated users only" ON coupons FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON campaigns;
CREATE POLICY "Enable read access for all users" ON campaigns FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON campaigns;
CREATE POLICY "Enable insert for authenticated users only" ON campaigns FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON campaigns;
CREATE POLICY "Enable update for authenticated users only" ON campaigns FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON campaigns;
CREATE POLICY "Enable delete for authenticated users only" ON campaigns FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON stores;
CREATE POLICY "Enable read access for all users" ON stores FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON stores;
CREATE POLICY "Enable insert for authenticated users only" ON stores FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON stores;
CREATE POLICY "Enable update for authenticated users only" ON stores FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON stores;
CREATE POLICY "Enable delete for authenticated users only" ON stores FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON sellers;
CREATE POLICY "Enable read access for all users" ON sellers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON sellers;
CREATE POLICY "Enable insert for authenticated users only" ON sellers FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON sellers;
CREATE POLICY "Enable update for authenticated users only" ON sellers FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON sellers;
CREATE POLICY "Enable delete for authenticated users only" ON sellers FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON customers;
CREATE POLICY "Enable read access for all users" ON customers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON customers;
CREATE POLICY "Enable insert for authenticated users only" ON customers FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON customers;
CREATE POLICY "Enable update for authenticated users only" ON customers FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON customers;
CREATE POLICY "Enable delete for authenticated users only" ON customers FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON customer_addresses;
CREATE POLICY "Enable read access for all users" ON customer_addresses FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON customer_addresses;
CREATE POLICY "Enable insert for authenticated users only" ON customer_addresses FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON customer_addresses;
CREATE POLICY "Enable update for authenticated users only" ON customer_addresses FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON customer_addresses;
CREATE POLICY "Enable delete for authenticated users only" ON customer_addresses FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON referral_settings;
CREATE POLICY "Enable read access for all users" ON referral_settings FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON referral_settings;
CREATE POLICY "Enable insert for authenticated users only" ON referral_settings FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON referral_settings;
CREATE POLICY "Enable update for authenticated users only" ON referral_settings FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON referral_settings;
CREATE POLICY "Enable delete for authenticated users only" ON referral_settings FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON brands;
CREATE POLICY "Enable read access for all users" ON brands FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON brands;
CREATE POLICY "Enable insert for authenticated users only" ON brands FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON brands;
CREATE POLICY "Enable update for authenticated users only" ON brands FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON brands;
CREATE POLICY "Enable delete for authenticated users only" ON brands FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON variant_types;
CREATE POLICY "Enable read access for all users" ON variant_types FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON variant_types;
CREATE POLICY "Enable insert for authenticated users only" ON variant_types FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON variant_types;
CREATE POLICY "Enable update for authenticated users only" ON variant_types FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON variant_types;
CREATE POLICY "Enable delete for authenticated users only" ON variant_types FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON variant_values;
CREATE POLICY "Enable read access for all users" ON variant_values FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON variant_values;
CREATE POLICY "Enable insert for authenticated users only" ON variant_values FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON variant_values;
CREATE POLICY "Enable update for authenticated users only" ON variant_values FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON variant_values;
CREATE POLICY "Enable delete for authenticated users only" ON variant_values FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON categories;
CREATE POLICY "Enable read access for all users" ON categories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON categories;
CREATE POLICY "Enable insert for authenticated users only" ON categories FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON categories;
CREATE POLICY "Enable update for authenticated users only" ON categories FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON categories;
CREATE POLICY "Enable delete for authenticated users only" ON categories FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON subcategories;
CREATE POLICY "Enable read access for all users" ON subcategories FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON subcategories;
CREATE POLICY "Enable insert for authenticated users only" ON subcategories FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON subcategories;
CREATE POLICY "Enable update for authenticated users only" ON subcategories FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON subcategories;
CREATE POLICY "Enable delete for authenticated users only" ON subcategories FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON reasons_for_return;
CREATE POLICY "Enable read access for all users" ON reasons_for_return FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON reasons_for_return;
CREATE POLICY "Enable insert for authenticated users only" ON reasons_for_return FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON reasons_for_return;
CREATE POLICY "Enable update for authenticated users only" ON reasons_for_return FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON reasons_for_return;
CREATE POLICY "Enable delete for authenticated users only" ON reasons_for_return FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON return_requests;
CREATE POLICY "Enable read access for all users" ON return_requests FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON return_requests;
CREATE POLICY "Enable insert for authenticated users only" ON return_requests FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON return_requests;
CREATE POLICY "Enable update for authenticated users only" ON return_requests FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON return_requests;
CREATE POLICY "Enable delete for authenticated users only" ON return_requests FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON delivery_partners;
CREATE POLICY "Enable read access for all users" ON delivery_partners FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON delivery_partners;
CREATE POLICY "Enable insert for authenticated users only" ON delivery_partners FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON delivery_partners;
CREATE POLICY "Enable update for authenticated users only" ON delivery_partners FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON delivery_partners;
CREATE POLICY "Enable delete for authenticated users only" ON delivery_partners FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON dispatch_tasks;
CREATE POLICY "Enable read access for all users" ON dispatch_tasks FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON dispatch_tasks;
CREATE POLICY "Enable insert for authenticated users only" ON dispatch_tasks FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON dispatch_tasks;
CREATE POLICY "Enable update for authenticated users only" ON dispatch_tasks FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON dispatch_tasks;
CREATE POLICY "Enable delete for authenticated users only" ON dispatch_tasks FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON pos_orders;
CREATE POLICY "Enable read access for all users" ON pos_orders FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON pos_orders;
CREATE POLICY "Enable insert for authenticated users only" ON pos_orders FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON pos_orders;
CREATE POLICY "Enable update for authenticated users only" ON pos_orders FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON pos_orders;
CREATE POLICY "Enable delete for authenticated users only" ON pos_orders FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable read access for all users" ON vendor_registrations;
CREATE POLICY "Enable read access for all users" ON vendor_registrations FOR SELECT USING (true);
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON vendor_registrations;
CREATE POLICY "Enable insert for authenticated users only" ON vendor_registrations FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON vendor_registrations;
CREATE POLICY "Enable update for authenticated users only" ON vendor_registrations FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL) WITH CHECK (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON vendor_registrations;
CREATE POLICY "Enable delete for authenticated users only" ON vendor_registrations FOR DELETE TO authenticated USING (auth.uid() IS NOT NULL);

-- Fix for anon/authenticated SECURITY DEFINER functions
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'rls_auto_enable') THEN
        ALTER FUNCTION public.rls_auto_enable() SECURITY INVOKER;
    END IF;
END $$;
