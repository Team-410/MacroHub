CREATE TABLE user (
    userid INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'user'
);
CREATE TABLE macro (
    macroid INT PRIMARY KEY AUTO_INCREMENT,
    macroname VARCHAR(255) NOT NULL,
    macrodescription VARCHAR(255) NOT NULL,
    app VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    macrotype VARCHAR(255) NOT NULL,
    macro TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE personal_list (
    listid INT PRIMARY KEY AUTO_INCREMENT,
    userid INT,
    macroid INT,
    activation_key VARCHAR(255),
    FOREIGN KEY (userid) REFERENCES user(userid),
    FOREIGN KEY (macroid) REFERENCES macro(macroid)
);
CREATE TABLE vote (
    voteid INT PRIMARY KEY AUTO_INCREMENT,
    macroid INT,
    userid INT,
    vote BOOLEAN NOT NULL,
    FOREIGN KEY (macroid) REFERENCES macro(macroid),
    FOREIGN KEY (userid) REFERENCES user(userid)
);
CREATE TABLE comment (
    commentid INT PRIMARY KEY AUTO_INCREMENT,
    macroid INT,
    fullname VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (macroid) REFERENCES macro(macroid)
);
CREATE INDEX idx_user_email ON user (email);
CREATE INDEX idx_macro_name ON macro (macroname);
CREATE INDEX idx_personal_list_userid ON personal_list (userid);
CREATE INDEX idx_personal_list_macroid ON personal_list (macroid);
CREATE INDEX idx_vote_macroid_userid ON vote (macroid, userid);
CREATE INDEX idx_comment_macroid ON comment (macroid);
CREATE INDEX idx_comment_timestamp ON comment (timestamp);

