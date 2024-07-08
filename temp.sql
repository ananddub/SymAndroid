CREATE TABLE tbl_adminannounce (
         messageid INT(11) NOT NULL AUTO_INCREMENT,      message TEXT NULL,
         to VARCHAR(200) NULL,
         from VARCHAR(200) NULL,
         date DATE NULL DEFAULT CURDATE(),
         time TIME NULL DEFAULT CURTIME(),
         class VARCHAR(30) NULL,
         sec VARCHAR(30) NULL,
         name VARCHAR(255) NULL,
         fname VARCHAR(255) NULL,
         mclass VARCHAR(10) NULL,
         msec VARCHAR(10) NULL,
         mroll VARCHAR(10) NULL,
         file TEXT NULL,
         PRIMARY KEY (messageid)
     );
