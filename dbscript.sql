CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL,
    fecha_registro DATE NOT NULL
);


CREATE TABLE categorias (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL
);


CREATE TABLE anuncios (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    descripcion TEXT NOT NULL,
    precio NUMERIC(10,2) NOT NULL,
    estado BOOLEAN NOT NULL,
    fecha_publicacion DATE NOT NULL,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    categoria_id INT NOT NULL REFERENCES categorias(id)
);

CREATE TABLE imagenes (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    anuncio_id INT NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE
);


CREATE TABLE anuncios_guardados (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    anuncio_id INT NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    fecha_guardado DATE NOT NULL,
    UNIQUE (usuario_id, anuncio_id) 
);


CREATE TABLE conversaciones (
    id SERIAL PRIMARY KEY,
    anuncio_id INT NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
    interesado_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    anunciante_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE TABLE mensajes (
    id SERIAL PRIMARY KEY,
    contenido TEXT NOT NULL,
    fecha_hora TIMESTAMP NOT NULL,
    emisor_id INT NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    conversacion_id INT NOT NULL REFERENCES conversaciones(id) ON DELETE CASCADE
);



select * from usuarios u ;
select * from conversaciones c ;
select * from anuncios a ;
select * from categorias c ;
select * from mensajes m ;


INSERT INTO usuarios (nombre, correo, contrasena, fecha_registro) VALUES 
('Richard', 'vendedor1@example.com', 'pass123', NOW()),
('Angelo', 'comprador1@example.com', 'pass1234', NOW());


INSERT INTO anuncios (titulo, descripcion,precio,estado,fecha_publicacion , usuario_id,categoria_id) VALUES 
('Laptop Lenovo', 'Laptop usada en buen estado',3400,true,NOW(),3, 1);

INSERT INTO categorias (nombre) VALUES 
('Computadoras y Laptop'),
('Componentes'),
('Periféricos'),
('Celulares y Tablets'),
('Redes y Conectividad'),
('Servicios')


INSERT INTO conversaciones (anuncio_id, anunciante_id, interesado_id) VALUES 
(2, 3, 4);

INSERT INTO mensajes (contenido, fecha_hora, conversacion_id, emisor_id) VALUES 
('Hola, ¿la laptop sigue disponible?', NOW(), 2, 4);


INSERT INTO mensajes (contenido, fecha_hora, conversacion_id, emisor_id) VALUES 
('¡Hola! Sí, aún la tengo disponible.', NOW(), 2, 3);


INSERT INTO mensajes (contenido, fecha_hora, conversacion_id, emisor_id) VALUES 
('¿Podrías enviarme más fotos?', NOW(), 2, 4);


INSERT INTO mensajes (contenido, fecha_hora, conversacion_id, emisor_id) VALUES 
('Claro, te las envío enseguida.', NOW(), 2, 3);


INSERT INTO anuncios (titulo, descripcion, precio, estado, fecha_publicacion, usuario_id, categoria_id) VALUES
('Macbook Pro', 'Vendo Macbook Pro con chip M1, excelente estado, ideal para trabajo y diseño.', 6200, TRUE, '2025-06-22', 1, 1),
('ASUS Zenbook 14', 'Ultrabook ligero, pantalla nítida, gran rendimiento. Muy poco uso.', 4200, TRUE, '2025-06-22', 3, 1),
('Laptop Lenovo ThinkPad', 'Laptop Lenovo ThinkPad, core i5, 8GB RAM, batería duradera, lista para trabajar.', 3400, TRUE, '2025-06-22', 2, 1),
('Laptop HP Pavilion', 'HP Pavilion 14”, 12GB RAM, muy rápida y en excelente estado. Ideal para estudiantes.', 3600, TRUE, '2025-06-22', 4, 1);


INSERT INTO anuncios (titulo, descripcion, precio, estado, fecha_publicacion, usuario_id, categoria_id) VALUES
('Ryzen 5 5600X', 'Procesador Ryzen 5 con 6 núcleos y 12 hilos, ideal para gamers o editores.', 950, TRUE, '2025-06-22', 2, 2),
('SSD Kingston 1TB', 'Vendo SSD 1TB, usado solo una vez, muy rápido y confiable.', 590, TRUE, '2025-06-22', 4, 2),
('Gabinete Cougar RGB', 'Gabinete gaming con luces RGB, incluye 3 ventiladores, como nuevo.', 420, TRUE, '2025-06-22', 3, 2),
('RAM 8GB DDR4 Kingston', 'Memoria RAM DDR4 de 8GB, excelente para mejorar rendimiento de tu PC.', 230, TRUE, '2025-06-22', 2, 2);


INSERT INTO anuncios (titulo, descripcion, precio, estado, fecha_publicacion, usuario_id, categoria_id) VALUES
('Teclado Mecánico RGB', 'Teclado mecánico retroiluminado RGB, ideal para gamers. Muy poco uso.', 330, TRUE, '2025-06-22', 1, 3),
('Mouse Logitech M330', 'Mouse inalámbrico Logitech, ultra silencioso, ideal para trabajar desde casa.', 95, TRUE, '2025-06-22', 1, 3),
('Cargador Universal 90W', 'Cargador universal para laptops, compatible con múltiples marcas. Poco uso.', 110, TRUE, '2025-06-22', 4, 3),
('Webcam Logitech HD 1080p', 'Cámara web HD 1080p, ideal para videollamadas, poco uso, funciona perfecto.', 280, TRUE, '2025-06-22', 2, 3);


INSERT INTO anuncios (titulo, descripcion, precio, estado, fecha_publicacion, usuario_id, categoria_id) VALUES
('Galaxy Tab S6 Lite', 'Tablet Samsung S6 Lite con S-Pen, ideal para clases o trabajo móvil.', 2100, TRUE, '2025-06-22', 2, 4),
('iPhone 11', 'iPhone 11 con carcasa incluida, cámara impecable. Lista para usar.', 4800, TRUE, '2025-06-22', 4, 4),
('Celular Redmi Note 12s', 'Vendo Redmi Note 12s, 256GB y 8GB RAM. Excelente estado, con funda.', 1200, TRUE, '2025-06-22', 4, 4),
('iPad Mini 5', 'iPad Mini 5 de 64GB, batería perfecta, ideal para estudiar o dibujar.', 2500, TRUE, '2025-06-22', 1, 4);

INSERT INTO anuncios (titulo, descripcion, precio, estado, fecha_publicacion, usuario_id, categoria_id) VALUES
('Router TP-Link AC1200', 'Router doble banda, perfecto para hogares grandes. Lo vendo por mudanza.', 230, TRUE, '2025-06-22', 3, 5),
('Switch TP-Link 5 puertos', 'Switch TP-Link 5 puertos, ideal para expandir red en casa u oficina.', 120, TRUE, '2025-06-22', 1, 5),
('Antena WiFi USB Alfa', 'Adaptador WiFi Alfa de largo alcance, ideal para PC o notebook.', 180, TRUE, '2025-06-22', 4, 5),
('Repetidor WiFi Xiaomi', 'Repetidor Xiaomi, mejora la señal en toda la casa. En caja.', 150, TRUE, '2025-06-22', 2, 5);


INSERT INTO anuncios (titulo, descripcion, precio, estado, fecha_publicacion, usuario_id, categoria_id) VALUES
('Armado de PC personalizado', 'Armo tu PC con tus componentes o te asesoro con la compra.', 150, TRUE, '2025-06-22', 2, 6),
('Licencia Windows 11 Pro', 'Vendo licencia original de Windows 11 Pro, válida y lista para activar.', 100, TRUE, '2025-06-22', 3, 6),
('Instalación de programas', 'Ofrezco instalación de Office, Windows, Adobe, antivirus, etc.', 50, TRUE, '2025-06-22', 4, 6),
('Licencia Microsoft Office', 'Suite Office original, incluye Word, Excel, PowerPoint. Entrega inmediata.', 300, TRUE, '2025-06-22', 4, 6);



INSERT INTO usuarios (id, nombre, correo, contrasena, fecha_registro) VALUES (1, 'Richard', 'vendedor1@example.com', 'pass123', '2025-05-18');
INSERT INTO usuarios (id, nombre, correo, contrasena, fecha_registro) VALUES (2, 'Angelo', 'comprador1@example.com', 'pass1234', '2025-05-18');
INSERT INTO usuarios (id, nombre, correo, contrasena, fecha_registro) VALUES (3, 'Laura', 'laura@example.com', '123456', '2025-06-21');
INSERT INTO usuarios (id, nombre, correo, contrasena, fecha_registro) VALUES (4, 'raul', 'raul@gmail.com', '123456789', '2025-06-21');




select * from usuarios u;
select * from anuncios;
select * from imagenes i;
select * from categorias c ;


SELECT 
    u.nombre AS emisor,
    m.contenido,
    m.fecha_hora
FROM mensajes m
JOIN usuarios u ON m.emisor_id = u.id
WHERE m.conversacion_id = 2
ORDER BY m.fecha_hora;



SELECT id 
FROM conversaciones 
WHERE anuncio_id = 2
  AND anunciante_id = 3
  AND interesado_id = 4;


SELECT * FROM information_schema.sequences WHERE sequence_schema = 'public';
ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;
ALTER SEQUENCE anuncios_id_seq RESTART WITH 1;
ALTER SEQUENCE imagenes_id_seq RESTART WITH 1;
alter sequence categorias_id_seq restart with 1;

delete from categorias ;
DELETE FROM imagenes;
DELETE FROM anuncios;
DELETE FROM usuarios;