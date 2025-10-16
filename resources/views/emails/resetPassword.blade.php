<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Reestablecer contraseña - Simexanestesia</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #333;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 10px rgba(0,0,0,0.08);
        }
        .header {
            background-color: #e4f3ed;
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-width: 200px;
        }
        .content {
            padding: 30px 25px;
            text-align: center;
        }
        .content h2 {
            color: #065f46;
            font-size: 22px;
            margin-bottom: 15px;
        }
        .content p {
            font-size: 16px;
            margin: 10px 0;
        }
        .key-box {
            margin: 20px auto;
            display: inline-block;
            background-color: #ecfdf5;
            border: 2px dashed #10b981;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 20px;
            font-weight: bold;
            color: #047857;
            letter-spacing: 1px;
        }
        .btn {
            display: inline-block;
            margin-top: 20px;
            background-color: #10b981;
            color: white !important;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: bold;
            font-size: 16px;
            transition: background 0.3s ease;
        }
        .btn:hover {
            background-color: #059669;
        }
        .footer {
            background-color: #e4f3ed;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://app.simexanestesia.com/storage/img/logo-sime-complete.png" alt="Simexanestesia">
        </div>

        <div class="content">
            <h2>Reestablece tu contraseña</h2>
            <p>Recupera tu cuenta haciendo click en el siguiente link:</p>

            <a href="{{ $resetUrl }}" class="btn">Reestablecer cuenta</a>

            <p>Si no solicitaste este cambio, puedes ignorar este correo.</p>
            <small>Este enlace es válido por tiempo limitado.</small>
        </div>

        <div class="footer">
            <div>© {{ date('Y') }} Simexanestesia</div>
            <a href="https://app.simexanestesia.com">app.Simexanestesia.com</a>
        </div>
    </div>
</body>
</html>
