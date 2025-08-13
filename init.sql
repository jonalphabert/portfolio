-- Create extension for UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create user_admin table
CREATE TABLE user_admin (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create category table
CREATE TABLE category (
    category_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) NOT NULL,
    category_slug VARCHAR(100) NOT NULL UNIQUE,
    category_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create blog table
CREATE TABLE blog (
    blog_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    blog_title VARCHAR(255) NOT NULL,
    blog_slug VARCHAR(255) NOT NULL UNIQUE,
    blog_content TEXT NOT NULL,
    blog_tags TEXT[],
    blog_user_id UUID NOT NULL REFERENCES user_admin(user_id),
    blog_status VARCHAR(20) DEFAULT 'draft' CHECK (blog_status IN ('draft', 'published', 'archived')),    blog_views INTEGER DEFAULT 0,
    blog_likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create blog_category table (junction table)
CREATE TABLE blog_category (
    blog_id UUID REFERENCES blog(blog_id),
    category_id UUID REFERENCES category(category_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (blog_id, category_id)
);

-- Create image_uploaded table
CREATE TABLE image_uploaded (
    image_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_name VARCHAR(255) NOT NULL,
    image_path TEXT NOT NULL,
    image_size INTEGER NOT NULL,
    image_type VARCHAR(50) NOT NULL,
    image_alt VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create blog_image_thumbnail table
CREATE TABLE blog_image_thumbnail (
    blog_id UUID REFERENCES blog(blog_id),
    image_id UUID REFERENCES image_uploaded(image_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (blog_id, image_id)
);

-- Create subscription table
CREATE TABLE subscription (
    subscription_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_name VARCHAR(100) NOT NULL,
    subscription_email VARCHAR(255) NOT NULL UNIQUE,
    subscription_created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subscription_updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    subscription_deleted_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX idx_blog_user ON blog(blog_user_id);
CREATE INDEX idx_blog_status ON blog(blog_status);
CREATE INDEX idx_blog_published ON blog(published_at);
CREATE INDEX idx_blog_slug ON blog(blog_slug);
CREATE INDEX idx_category_slug ON category(category_slug);
CREATE INDEX idx_blog_category_blog ON blog_category(blog_id);
CREATE INDEX idx_blog_category_category ON blog_category(category_id);
CREATE INDEX idx_blog_image_blog ON blog_image_thumbnail(blog_id);
CREATE INDEX idx_blog_image_image ON blog_image_thumbnail(image_id);
CREATE INDEX idx_subscription_email ON subscription(subscription_email);

-- Add triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_admin_updated_at
    BEFORE UPDATE ON user_admin
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_category_updated_at
    BEFORE UPDATE ON category
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_updated_at
    BEFORE UPDATE ON blog
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_category_updated_at
    BEFORE UPDATE ON blog_category
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_image_uploaded_updated_at
    BEFORE UPDATE ON image_uploaded
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_image_thumbnail_updated_at
    BEFORE UPDATE ON blog_image_thumbnail
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_updated_at
    BEFORE UPDATE ON subscription
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add thumbnail_id column to blog table
ALTER TABLE blog ADD COLUMN thumbnail_id UUID REFERENCES image_uploaded(image_id);
