-- Crea usuarios base por rol si aun no existen en la base actual.

INSERT INTO usuarios (rol_id, nombre, correo, contrasena)
SELECT 1, 'Administrador General', 'admin@latosteleria.com', '$2y$10$ZKc.NCagjTWKETLuR71YtOkAEX9ybXBQJ7gyAhJnq4dW2P4xxrPxO'
FROM DUAL
WHERE EXISTS (SELECT 1 FROM roles WHERE id_rol = 1)
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'admin@latosteleria.com');

INSERT INTO usuarios (rol_id, nombre, correo, contrasena)
SELECT 2, 'Cliente Demo', 'cliente@latosteleria.com', '$2y$10$soR8dBLDIblltcguYhhKLOy9cxCWUV3y21G.eGSUFDZpXkgthnDGS'
FROM DUAL
WHERE EXISTS (SELECT 1 FROM roles WHERE id_rol = 2)
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'cliente@latosteleria.com');

INSERT INTO usuarios (rol_id, nombre, correo, contrasena)
SELECT 3, 'Empleado Demo', 'empleado@latosteleria.com', '$2y$10$z9DtusWwAIFjhPLR3YgqruXBPOiVuYxU/VtsqjEoWVwWcV2YuC.Eq'
FROM DUAL
WHERE EXISTS (SELECT 1 FROM roles WHERE id_rol = 3)
  AND NOT EXISTS (SELECT 1 FROM usuarios WHERE correo = 'empleado@latosteleria.com');