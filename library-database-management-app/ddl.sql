
SET FOREIGN_KEY_CHECKS=0;
SET AUTOCOMMIT = 0;

-- -----------------------------------------------------
-- Table `Authors`
-- -----------------------------------------------------

/* Represents the individual author for each book(s) */ 

CREATE OR REPLACE TABLE `Authors` (
  `authorID` INT NOT NULL AUTO_INCREMENT,
  `authorFirstName` varchar(255) NOT NULL,
  `authorLastName` varchar(255) NOT NULL,
  PRIMARY KEY (`authorID`),
  UNIQUE (`authorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- -----------------------------------------------------
-- Insert `Authors`
-- -----------------------------------------------------

INSERT INTO `Authors` (`authorFirstName`, `authorLastName`) VALUES
('J.K.', 'Rowling'),
('Jane', 'Austen'),
('Conan', 'Doyle'),
('Stephen', 'King'),
('Peter', 'Straub');

-- -----------------------------------------------------
-- Table `Books`
-- ----------------------------------------------------- 

/* Represents a book title in the library */ 

CREATE OR REPLACE TABLE `Books` (
  `bookID` INT NOT NULL AUTO_INCREMENT,
  `bookTitle` varchar(255) NOT NULL,
  `genre` varchar(45) NOT NULL,
  `numCopies` INT NOT NULL,
  PRIMARY KEY (`bookID`),
  UNIQUE (`bookID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- -----------------------------------------------------
-- Insert `Books`
-- -----------------------------------------------------

INSERT INTO `Books` (`bookTitle`, `genre`, `numCopies`) VALUES
('Harry Potter and the Chamber of Secrets', 'fantasy', 5),
('Harry Potter and the Prisoner of Azkaban', 'fantasy', 5),
('Sherlock Holmes', 'mystery', 5),
('Pride and Prejudice', 'mystery', 5),
('The Talisman', 'fantasy', 5);

-- -----------------------------------------------------
-- Table `Employees`
-- -----------------------------------------------------

/* Records employee information including name, email and ID */ 

CREATE OR REPLACE TABLE `Employees` (
  `employeeID` INT NOT NULL AUTO_INCREMENT,
  `employeeFirstName` varchar(255) NOT NULL,
  `employeeLastName` varchar(255) NOT NULL,
  `employeeEmail` varchar(255) NOT NULL,
  PRIMARY KEY (`employeeID`),
  UNIQUE (`employeeID`),
  UNIQUE (`employeeEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- -----------------------------------------------------
-- Insert `Employees`
-- -----------------------------------------------------

INSERT INTO `Employees` (`employeeFirstName`, `employeeLastName`, `employeeEmail`) VALUES
('Haley', 'Smith', 'haleysmith@gmail.com'),
('John', 'Martin', 'johnmartin@gmail.com'),
('Sue', 'Sylvester', 'suesylvester@gmail.com'),
('Brad', 'Pitt', 'bradpitt@gmail.com'),
('Annie', 'Hall', 'anniehall@gmail.com');

-- -----------------------------------------------------
-- Table `Members`
-- -----------------------------------------------------

/* Records members of the library including name, email and ID */ 

CREATE OR REPLACE TABLE `Members` (
  `memberID` INT NOT NULL AUTO_INCREMENT,
  `memberFirstName` varchar(255) NOT NULL,
  `memberLastName` varchar(255) NOT NULL,
  `memberEmail` varchar(255) NOT NULL,
  PRIMARY KEY (`memberID`),
  UNIQUE (`memberID`),
  UNIQUE (`memberEmail`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

-- -----------------------------------------------------
-- Insert `Members`
-- -----------------------------------------------------

INSERT INTO `Members` (`memberFirstName`, `memberLastName`, `memberEmail`) VALUES
('Taylor', 'Swift', 'swiftie101@gmail.com'),
('John', 'Cena', 'biker23@gmail.com'),
('Eddie', 'Murphy', 'edmurphy@yahoo.com'),
('Hannah', 'Montana', 'cowgirl3@yahoo.com'),
('Miley', 'Cyrus', 'singsingsing@gmail.com');

-- -----------------------------------------------------
-- Table `BooksAuthors`
-- -----------------------------------------------------

/* Book details for authors and books */ 

CREATE OR REPLACE TABLE `BooksAuthors` (
  `booksAuthorsID` INT NOT NULL AUTO_INCREMENT,
  `bookID` INT NOT NULL,
  `authorID` INT NOT NULL,
  PRIMARY KEY (`booksAuthorsID`),
  UNIQUE (`booksAuthorsID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

ALTER TABLE `BooksAuthors`
  ADD CONSTRAINT `fk_Books_has_Authors_Authors1`
    FOREIGN KEY (`authorID`)
    REFERENCES `Authors` (`authorID`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE;

ALTER TABLE `BooksAuthors`
  ADD CONSTRAINT `fk_Books_has_Authors_Books1`
    FOREIGN KEY  (`bookID`)
    REFERENCES `Books` (`BookID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- -----------------------------------------------------
-- Insert `BooksAuthors`
-- -----------------------------------------------------

INSERT INTO `BooksAuthors` (`bookID`, `authorID`) VALUES
(1, 1),
(2, 1),
(3, 3),
(4, 2),
(5, 4),
(5, 5);

-- -----------------------------------------------------
-- Table `Checkouts`
-- -----------------------------------------------------

/* Information about the checkout of a book */ 

CREATE OR REPLACE TABLE `Checkouts` (
  `checkoutID` INT NOT NULL AUTO_INCREMENT,
  `memberID` INT NOT NULL,
  `employeeID` INT DEFAULT NULL,
  `dateCheckedOut` date NOT NULL,
  `dateDue` date NOT NULL,
  PRIMARY KEY (`checkoutID`),
  CONSTRAINT Checkouts_chk_dates CHECK (dateDue > dateCheckedOut),
  UNIQUE (`checkoutID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

ALTER TABLE `Checkouts`
  ADD CONSTRAINT `fk_Checkouts_Employees1`
    FOREIGN KEY (`employeeID`)
    REFERENCES `Employees` (`employeeID`)
    ON DELETE SET NULL;

ALTER TABLE `Checkouts`
  ADD CONSTRAINT `fk_Checkouts_Members`
    FOREIGN KEY (`memberID`)
    REFERENCES `Members` (`memberID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

    -- -----------------------------------------------------
-- Insert `Checkouts`
-- -----------------------------------------------------

INSERT INTO `Checkouts` (`memberID`, `employeeID`, `dateCheckedOut`, `dateDue`) VALUES
(3, 1, '2024-04-09', '2024-04-29'),
(3, 5, '2023-03-05', '2023-03-25'),
(2, 4, '2023-11-02', '2023-11-23'),
(1, 4, '2022-05-05', '2022-05-25'),
(4, 2, '2023-12-06', '2023-12-26'),
(4, NULL, '2023-12-02', '2023-12-22');

-- -----------------------------------------------------
-- Table `BooksCheckouts`
-- -----------------------------------------------------

/* Checkout details for book and checkout */ 

CREATE OR REPLACE TABLE `BooksCheckouts` (
  `booksCheckoutsID` INT NOT NULL AUTO_INCREMENT,
  `checkoutID` INT NOT NULL,
  `bookID` INT NOT NULL,
  `dateReturned` date DEFAULT NULL,
  PRIMARY KEY  (`booksCheckoutsID`),
  UNIQUE (`booksCheckoutsID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

ALTER TABLE `BooksCheckouts`
  ADD CONSTRAINT `fk_Checkouts_has_Books_Books1`
    FOREIGN KEY (`bookID`)
    REFERENCES `Books` (`bookID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;
  
ALTER TABLE `BooksCheckouts`
  ADD CONSTRAINT `fk_Checkouts_has_Books_Checkouts1`
    FOREIGN KEY  (`checkoutID`)
    REFERENCES `Checkouts` (`checkoutID`)
    ON DELETE CASCADE
    ON UPDATE CASCADE;

-- -----------------------------------------------------
-- Insert `BooksCheckouts`
-- -----------------------------------------------------

INSERT INTO `BooksCheckouts` (`checkoutID`, `bookID`, `dateReturned`) VALUES
(1, 2, NULL),
(2, 2, '2023-03-20'),
(4, 3, '2022-05-22'),
(4, 5, '2022-05-10'),
(3, 4, '2023-11-20');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;

