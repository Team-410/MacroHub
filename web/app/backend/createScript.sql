CREATE TABLE IF NOT EXISTS user (
    userid INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user'
);
CREATE TABLE IF NOT EXISTS macro (
    macroid INT PRIMARY KEY AUTO_INCREMENT,
    macroname VARCHAR(255) NOT NULL,
    macrodescription VARCHAR(255) NOT NULL,
    app VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    macrotype VARCHAR(255) NOT NULL,
    macro TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS personal_list (
    listid INT PRIMARY KEY AUTO_INCREMENT,
    userid INT,
    macroid INT,
    activation_key VARCHAR(255),
    FOREIGN KEY (userid) REFERENCES user(userid),
    FOREIGN KEY (macroid) REFERENCES macro(macroid)
);
CREATE TABLE IF NOT EXISTS vote (
    voteid INT PRIMARY KEY AUTO_INCREMENT,
    macroid INT,
    userid INT,
    vote BOOLEAN NOT NULL,
    FOREIGN KEY (macroid) REFERENCES macro(macroid),
    FOREIGN KEY (userid) REFERENCES user(userid)
);
CREATE TABLE IF NOT EXISTS comment (
    commentid INT PRIMARY KEY AUTO_INCREMENT,
    macroid INT,
    fullname VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (macroid) REFERENCES macro(macroid)
);


