CREATE TABLE user (
    userid INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') NOT NULL
);

CREATE TABLE macro (
    macroid INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    game VARCHAR(100) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sub_category VARCHAR(100),
    macro TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE personal_list (
    listid INT AUTO_INCREMENT PRIMARY KEY,
    userid INT NOT NULL,
    macroid INT NOT NULL,
    activation_key VARCHAR(50) NOT NULL,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE,
    FOREIGN KEY (macroid) REFERENCES macro(macroid) ON DELETE CASCADE
);

CREATE TABLE comment (
    commentid INT AUTO_INCREMENT PRIMARY KEY,
    macroid INT NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    comment TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (macroid) REFERENCES macro(macroid) ON DELETE CASCADE
);

CREATE TABLE `like` (
    likeid INT AUTO_INCREMENT PRIMARY KEY,
    macroid INT NOT NULL,
    userid INT NOT NULL,
    FOREIGN KEY (macroid) REFERENCES macro(macroid) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES user(userid) ON DELETE CASCADE
);

CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_user_list ON personal_list(userid, macroid);
CREATE INDEX idx_user_like ON `like`(macroid, userid);

SHOW TABLES;
