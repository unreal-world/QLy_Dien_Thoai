-- Database will be created automatically if it doesn't exist.
-- Tables will be created directly in the active database.

-- 2. Bảng User
CREATE TABLE User (
    userID VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fullName VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phoneNumber VARCHAR(15) NOT NULL,
    role ENUM('CUSTOMER', 'ADMIN') NOT NULL
);

-- 3. Bảng Address (Quan hệ 1-n với User: Một User có nhiều địa chỉ)
CREATE TABLE Address (
    addressID VARCHAR(50) PRIMARY KEY,
    userID VARCHAR(50),
    city VARCHAR(50),
    ward VARCHAR(50),
    street VARCHAR(100),
    houseNumber VARCHAR(20),
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

-- 4. Bảng Product
CREATE TABLE Product (
    productID VARCHAR(50) PRIMARY KEY,
    productName VARCHAR(200) NOT NULL,
    brand VARCHAR(100),
    price DOUBLE NOT NULL,
    stock_quantity INT DEFAULT 0,
    description TEXT
);

-- 5. Bảng Image (Quan hệ 1-n với Product)
CREATE TABLE Image (
    imageID VARCHAR(50) PRIMARY KEY,
    productID VARCHAR(50),
    imageSource VARCHAR(255),
    imagePosition INT NOT NULL DEFAULT 0,
    FOREIGN KEY (productID) REFERENCES Product(productID) ON DELETE CASCADE
);

-- 6. Bảng Cart (Quan hệ 1-1 với User)
CREATE TABLE Cart (
    cartID VARCHAR(50) PRIMARY KEY,
    userID VARCHAR(50) UNIQUE,
    FOREIGN KEY (userID) REFERENCES User(userID) ON DELETE CASCADE
);

-- 7. Bảng CartItem (Quan hệ n-1 với Cart và n-1 với Product)
CREATE TABLE CartItem (
    cartItemID VARCHAR(50) PRIMARY KEY,
    cartID VARCHAR(50),
    productID VARCHAR(50),
    quantity INT NOT NULL,
    FOREIGN KEY (cartID) REFERENCES Cart(cartID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES Product(productID)
);

-- 8. Bảng Order
CREATE TABLE `Order` (
    orderID VARCHAR(50) PRIMARY KEY,
    userID VARCHAR(50),
    orderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    orderStatus ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED') NOT NULL,
    shippingAddress TEXT,
    receiver VARCHAR(100),
    phoneNumber VARCHAR(15),
    FOREIGN KEY (userID) REFERENCES User(userID)
);

-- 9. Bảng OrderDetail (Quan hệ n-1 với Order và n-1 với Product)
CREATE TABLE OrderDetail (
    orderDetailID VARCHAR(50) PRIMARY KEY,
    orderID VARCHAR(50),
    productID VARCHAR(50),
    quantity INT NOT NULL,
    unitPrice DOUBLE NOT NULL,
    totalPrice DOUBLE NOT NULL,
    FOREIGN KEY (orderID) REFERENCES `Order`(orderID) ON DELETE CASCADE,
    FOREIGN KEY (productID) REFERENCES Product(productID)
);
