package com.example.demo.util;

import java.sql.SQLException;
import java.util.Properties;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.example.demo.DAO.procedure.CallerClient;
import com.example.demo.entity.Login;

public class SendEmail {


  public String sendNewClient(String myEmail) {
    Login login = null;
    try {
      CallerClient callerClient = new CallerClient();
      login = callerClient.getLoginInit(myEmail);
    } catch (ClassNotFoundException | SQLException e) {

      e.printStackTrace();
    }

    // Debemos de obtener el user y la password del email
    String usery = login.getUser(), password = login.getPassword();
    // Es necesario mencionar el ID de correo electrónico del destinatario.
    String to = "achairadil@gmail.com";// this.myEmail;
    // Se debe mencionar el ID de correo electrónico del remitente
    String from = "**************";
    // Se debe mencionar el key de correo electrónico del remitente
    String key = "********";
    // Suponiendo que está enviando un correo electrónico a través de gmails smtp
    String host = "smtp.gmail.com";
    // Obtener propiedades del sistema
    Properties properties = System.getProperties();
    // Configurar servidor de correo
    properties.put("mail.smtp.host", host);
    properties.put("mail.smtp.port", "465");
    properties.put("mail.smtp.ssl.enable", "true");
    properties.put("mail.smtp.auth", "true");
    properties.put("mail.smtp.starttls.enable", "true");
    // Obtenga el objeto Session.// y pase el nombre de usuario y la contraseña
    Session session = Session.getInstance(properties, new javax.mail.Authenticator() {

      protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(from, key);
      }

    });
    // Se utiliza para depurar problemas de SMTP
    session.setDebug(true);

    try {
      // Crea un objeto MimeMessage predeterminado.
      MimeMessage message = new MimeMessage(session);

      // Establecer desde: campo de encabezado del encabezado.
      message.setFrom(new InternetAddress(from));

      // Establecer en: campo de encabezado del encabezado.
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

      // Establecer Asunto: campo de encabezado
      message.setSubject("Registro en Harnina20!");

      // Ahora configura el mensaje real
      message.setText("Te has registrado correctamente tu usuario es " + usery + " y tu password es " + password
          + ".  Cambia tu contraseña y destruye el email");

      System.out.println("Enviando...");
      // Enviar mensaje
      Transport.send(message);
      System.out.println("Mensaje enviado con éxito .......");
    } catch (MessagingException mex) {
      mex.printStackTrace();
    }
    return "Mensaje enviado";
  }

  public  String sendToBlockClient(String myEmail) {
   
    // Es necesario mencionar el ID de correo electrónico del destinatario.
    String to = "carloscano3.cc@gmail.com";// this.myEmail;
    // Se debe mencionar el ID de correo electrónico del remitente
    String from = "carloscano3.cc@gmail.com";
    // Se debe mencionar el key de correo electrónico del remitente
    String key = "davidvilla7";
    // Suponiendo que está enviando un correo electrónico a través de gmails smtp
    String host = "smtp.gmail.com";
    // Obtener propiedades del sistema
    Properties properties = System.getProperties();
    // Configurar servidor de correo
    properties.put("mail.smtp.host", host);
    properties.put("mail.smtp.port", "465");
    properties.put("mail.smtp.ssl.enable", "true");
    properties.put("mail.smtp.auth", "true");
    properties.put("mail.smtp.starttls.enable", "true");
    // Obtenga el objeto Session.// y pase el nombre de usuario y la contraseña
    Session session = Session.getInstance(properties, new javax.mail.Authenticator() {

      protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(from, key);
      }

    });
    // Se utiliza para depurar problemas de SMTP
    session.setDebug(true);

    try {
      // Crea un objeto MimeMessage predeterminado.
      MimeMessage message = new MimeMessage(session);

      // Establecer desde: campo de encabezado del encabezado.
      message.setFrom(new InternetAddress(from));

      // Establecer en: campo de encabezado del encabezado.
      message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));

      // Establecer Asunto: campo de encabezado
      message.setSubject("Cuenta bloqueada");

      // Ahora configura el mensaje real
      message.setText("Hola, hemos recibido 3 intentos de inicio de sesion, pero la contraseña era incorrecta. Te hemos bloqueado.");

      System.out.println("Enviando...");
      // Enviar mensaje
      Transport.send(message);
      System.out.println("Mensaje enviado con éxito .......");
    } catch (MessagingException mex) {
      mex.printStackTrace();
    }
    return "Mensaje enviado";
  }


}
