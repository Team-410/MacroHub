CREATE TABLE user (
    userid INT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);
CREATE TABLE macro (
    macroid INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    subcategory VARCHAR(255) NOT NULL,
    macro TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE personal_list (
    listid INT PRIMARY KEY,
    userid INT,
    macroid INT,
    activation_key VARCHAR(255),
    FOREIGN KEY (userid) REFERENCES user(userid),
    FOREIGN KEY (macroid) REFERENCES macro(macroid)
);
CREATE TABLE likes (
    likeid INT PRIMARY KEY,
    macroid INT,
    userid INT,
    FOREIGN KEY (macroid) REFERENCES macro(macroid),
    FOREIGN KEY (userid) REFERENCES user(userid)
);
CREATE TABLE comment (
    commentid INT PRIMARY KEY,
    macroid INT,
    fullname VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (macroid) REFERENCES macro(macroid)
);

CREATE INDEX idx_user_email ON user(email);
CREATE INDEX idx_macro_category ON macro(category);
CREATE INDEX idx_macro_subcategory ON macro(subcategory);
CREATE INDEX idx_likes_macroid ON likes(macroid);
CREATE INDEX idx_likes_userid ON likes(userid);
CREATE INDEX idx_comment_macroid ON comment(macroid);
