CREATE DATABASE AccelokaDb;

CREATE TABLE Tickets (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    ticketCode NVARCHAR(10) NOT NULL UNIQUE,
    ticketName NVARCHAR(100) NOT NULL,
    categoryName NVARCHAR(50) NOT NULL,
    eventDate DATETIME2 NOT NULL,
    price DECIMAL(18,2) NOT NULL,
    quota INT NOT NULL,
    isActive BIT NOT NULL DEFAULT 1,
    createdAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE BookedTickets (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    BookingDate DATETIME2 NOT NULL,
    status NVARCHAR(20) NOT NULL DEFAULT 'Booked',
    createdAt DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

CREATE TABLE BookedTicketsDetail (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    BookedTicketId INT NOT NULL,
    ticketCode NVARCHAR(10) NOT NULL,
    quantity INT NOT NULL,
    updatedAt DATETIME2 NULL,

    CONSTRAINT FK_BookedTicketsDetail_BookedTickets
        FOREIGN KEY (BookedTicketId)
        REFERENCES BookedTickets(Id)
        ON DELETE CASCADE,

    CONSTRAINT FK_BookedTicketsDetail_Tickets
        FOREIGN KEY (ticketCode)
        REFERENCES Tickets(ticketCode)
);

INSERT INTO Tickets (TicketCode, TicketName, CategoryName, EventDate, Price, Quota, IsActive) VALUES
-- BIOSKOP
('BIO001', 'Avengers Movie', 'Bioskop', '2026-03-01', 50000, 100, 1),
('BIO002', 'Batman Premiere', 'Bioskop', '2026-03-05', 55000, 80, 1),
('BIO003', 'Spiderman 4DX', 'Bioskop', '2026-03-10', 75000, 60, 1),

-- KONSER
('KON001', 'Coldplay Concert', 'Konser', '2026-04-12', 1500000, 200, 1),
('KON002', 'Taylor Swift Live', 'Konser', '2026-05-01', 2000000, 150, 1),
('KON003', 'Local Indie Fest', 'Konser', '2026-03-20', 300000, 300, 1),

-- KERETA
('KER001', 'Jakarta - Bandung', 'Kereta', '2026-02-20', 150000, 120, 1),
('KER002', 'Jakarta - Surabaya', 'Kereta', '2026-02-25', 350000, 90, 1),
('KER003', 'Bandung - Yogyakarta', 'Kereta', '2026-03-03', 250000, 100, 1),

-- KAPAL LAUT
('KAP001', 'Jakarta - Batam', 'Kapal Laut', '2026-03-15', 200000, 180, 1),
('KAP002', 'Surabaya - Makassar', 'Kapal Laut', '2026-03-18', 400000, 160, 1),

-- PESAWAT
('PES001', 'Jakarta - Bali', 'Pesawat', '2026-02-22', 1200000, 140, 1),
('PES002', 'Jakarta - Singapore', 'Pesawat', '2026-02-28', 1800000, 130, 1),

-- HOTEL
('HOT001', 'Hotel Bali 3D2N', 'Hotel', '2026-03-01', 2500000, 50, 1),
('HOT002', 'Hotel Bandung 2D1N', 'Hotel', '2026-03-05', 750000, 70, 1);
