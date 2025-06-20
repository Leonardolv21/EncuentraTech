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
('Laptops'),
('Gaming'),
('Ultraligeras'),
('Perifericos')


INSERT INTO conversaciones (anuncio_id, anunciante_id, interesado_id) VALUES 
(2, 3, 4);

-- Mensaje del comprador (interesado_id = 4)
INSERT INTO mensajes (contenido, fecha_hora, conversacion_id, emisor_id) VALUES 
('Hola, ¿la laptop sigue disponible?', NOW(), 2, 4);

-- Respuesta del vendedor (anunciante_id = 3)
INSERT INTO mensajes (contenido, fecha_hora, conversacion_id, emisor_id) VALUES 
('¡Hola! Sí, aún la tengo disponible.', NOW(), 2, 3);

-- Mensaje del comprador
INSERT INTO mensajes (contenido, fecha_hora, conversacion_id, emisor_id) VALUES 
('¿Podrías enviarme más fotos?', NOW(), 2, 4);

-- Respuesta del vendedor
INSERT INTO mensajes (contenido, fecha_hora, conversacion_id, emisor_id) VALUES 
('Claro, te las envío enseguida.', NOW(), 2, 3);


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
 
 select * from usuarios u;

	