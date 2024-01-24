INSERT INTO [dbo].[AccountTypes] ([Name], [Description], [Currency], [IsDeleted])
VALUES
('Osnovni račun', 'Osnovni bankovni račun sa minimalnim naknadama.', 'RSD', 0),
('Štedni račun', 'Račun za štednju sa povoljnom kamatnom stopom.', 'EUR', 0),
('Poslovni račun', 'Račun namenjen poslovnim korisnicima sa proširenim mogućnostima.', 'USD', 0),
('Studentski račun', 'Pogodnosti za studente, bez mesečnih održavanja.', 'RSD', 1),
('Zajednički račun', 'Račun za više korisnika sa zajedničkim resursima.', 'EUR', 0);
