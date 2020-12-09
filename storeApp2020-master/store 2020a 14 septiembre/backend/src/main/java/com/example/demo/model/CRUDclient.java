package com.example.demo.model;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import org.json.JSONArray;
import net.minidev.json.JSONObject;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import com.example.demo.DAO.procedure.CallerClient;
import com.example.demo.entity.Client;
import com.example.demo.entity.Login;
import com.example.demo.error.ErrorValidate;
import com.example.demo.error.ErrorVerify;
import com.example.demo.util.AddErrorArrayError;
import com.example.demo.util.GetDataControlFromValue;
import com.example.demo.util.SendEmail;
import com.example.demo.validate.ValidatorLengthComposite;
import com.example.demo.validate.ValidatorValueComposite;
import com.example.demo.verify.VerifyClient;
import com.example.demo.verify.VerifyLoginClient;

public class CRUDclient {

  JSONArray arrayJson;
  HashMap<String, ArrayList<ErrorValidate>> errorsValidation;
  HashMap<String, ErrorVerify> errorsVerification;
  SendEmail sendEmail= new SendEmail();
  public CRUDclient() {
    arrayJson = new JSONArray();
    errorsValidation = new HashMap<String, ArrayList<ErrorValidate>>();
    errorsVerification = new HashMap<String, ErrorVerify>();
  }

  public JSONArray addClient(Client client) {

    errorsValidation = getErrorsLength(client);
    Boolean error = false;
    CallerClient callerClient;
    SendEmail sendemail;
    if (errorsValidation.isEmpty()) {
      errorsValidation = getErrorsValue(client);
      if (errorsValidation.isEmpty()) {
        try {
          errorsVerification = getErrorsVerify(client);
        } catch (SQLException e) {
          e.printStackTrace();
        }
        if (errorsVerification.isEmpty()) {
          try {
            callerClient = new CallerClient();

            if (callerClient.addClient(client)) {
              successfulAction("addClient");
              sendemail = new SendEmail();
              sendemail.sendNewClient(client.getEmail());
            } else {
              failedAction("addClient");
            }
          } catch (ClassNotFoundException | SQLException e) {

            e.printStackTrace();
          }

        } else {
          for (java.util.Map.Entry<String, ErrorVerify> entry : errorsVerification.entrySet()) {
            JSONObject oneJson = new JSONObject();
            oneJson.put("messageErrorControl", entry.getValue().getMsgEs());
            oneJson.put("messageValueControl", entry.getKey());
            oneJson.put("messageNameControl", GetDataControlFromValue.getDataControlClient(client, entry.getKey()));
            arrayJson.put(oneJson);
          }
          return arrayJson;
        }

      } else {
        error = true;
      }
    } else {
      error = true;
    }
    if (error) {
      for (java.util.Map.Entry<String, ArrayList<ErrorValidate>> entry : errorsValidation.entrySet()) {
        ArrayList<ErrorValidate> myerror = entry.getValue();
        myerror.forEach((n) -> {
          JSONObject oneJson = new JSONObject();
          oneJson.put("messageErrorControl", n.getMsgEs());
          oneJson.put("messageValueControl", entry.getKey());
          oneJson.put("messageNameControl", GetDataControlFromValue.getDataControlClient(client, entry.getKey()));
          arrayJson.put(oneJson);
        });
      }
    }
    return arrayJson;
  }

  public JSONArray loginClient(Login user) {
    errorsValidation = getErrorsLength(user);
    Boolean error = false;
    if (errorsValidation.isEmpty()) {
      errorsValidation = getErrorsValue(user);
      if (errorsValidation.isEmpty()) {
        try {
          errorsVerification = getErrorsVerify(user);
          if (errorsVerification.isEmpty()) {
            System.out.println("Logeado perfectamente");
            successfulAction("loginClient");
            
          } else {
            System.out.println("Entro en el else");
            try {
              CallerClient callerClient = new CallerClient();
              String nombreUsuario= user.getUser();
              if (!callerClient.isBlocked(nombreUsuario)) {
                System.out.println("Compruebo que el usuario no está bloqueado");
                int variableError= (int) RequestContextHolder.currentRequestAttributes().getAttribute("variableError",
                RequestAttributes.SCOPE_SESSION );
                variableError++;
                RequestContextHolder.currentRequestAttributes().setAttribute("variableError", variableError, RequestAttributes.SCOPE_SESSION);
                System.out.println("Intentos "+variableError);
                 int limit= (int) RequestContextHolder.currentRequestAttributes().getAttribute("limit",
                 RequestAttributes.SCOPE_SESSION );
                 System.out.println("limite "+limit);
                 if(variableError==limit){
                   System.out.println("te has pasado de errores.");
                   try {
                     System.out.println("Estoy aqui");
                    
                    System.out.println("He cogido el usuario"+nombreUsuario);
                     if(callerClient.UserExist_client(nombreUsuario)){
                       System.out.println("El usuario existe");
                       sendEmail.sendToBlockClient(callerClient.getEmail(nombreUsuario));
                       System.out.println("Obtengo el email bien y lo mando");
                       callerClient.BlockUser(nombreUsuario);
                       System.out.println("Bloqueo al usuario");
                     } else{
                      JSONObject oneJson = new JSONObject();
                      oneJson.put("messageErrorBlocker", "bloqueado");
                      oneJson.put("error",610);
                      oneJson.put("tiempoBloqueo", 10);
                      oneJson.put("idButton","submit");
                      oneJson.put("idErrorBox", "boxerror_");
                      arrayJson.put(oneJson);
                     }
                   } catch (Exception e) {
                   }
                   variableError=0;
                   RequestContextHolder.currentRequestAttributes().setAttribute("variableError",  variableError,
                  RequestAttributes.SCOPE_SESSION );
                 }
                 for (java.util.Map.Entry<String, ErrorVerify> entry : errorsVerification.entrySet()) {
                   JSONObject oneJson = new JSONObject();
                   oneJson.put("messageErrorControl", entry.getValue().getMsgEs());
                   oneJson.put("messageValueControl", entry.getKey());
                   oneJson.put("messageNameControl", GetDataControlFromValue.getDataControlClient(user, entry.getKey()));
                   arrayJson.put(oneJson);
                 }
                 return arrayJson;
              }
            } catch (Exception e) {
              
            }
          }
        } catch (SQLException e) {
          e.printStackTrace();
        }
      } else {
        error = true;
      }
    } else {
      error = true;
    }
    if (error) {
      for (java.util.Map.Entry<String, ArrayList<ErrorValidate>> entry : errorsValidation.entrySet()) {
        ArrayList<ErrorValidate> myerror = entry.getValue();
        myerror.forEach((n) -> {
          JSONObject oneJson = new JSONObject();
          oneJson.put("messageErrorControl", n.getMsgEs());
          oneJson.put("messageValueControl", entry.getKey());
          oneJson.put("messageNameControl", GetDataControlFromValue.getDataControlClient(user, entry.getKey()));
          arrayJson.put(oneJson);
        });
      }
    }

    return arrayJson;

  }

  private HashMap<String, ArrayList<ErrorValidate>> getErrorsValue(Client client) {
    HashMap<String, ArrayList<ErrorValidate>> errorsAll = new HashMap<>();
    errorsAll = new AddErrorArrayError(new ValidatorValueComposite().validate(client), errorsAll).getErrorsAll();
    return errorsAll;
  }

  private HashMap<String, ArrayList<ErrorValidate>> getErrorsValue(Login login) {
    HashMap<String, ArrayList<ErrorValidate>> errorsAll = new HashMap<>();
    errorsAll = new AddErrorArrayError(new ValidatorValueComposite().validate(login), errorsAll).getErrorsAll();
    return errorsAll;
  }

  private HashMap<String, ArrayList<ErrorValidate>> getErrorsLength(Client client) {
    HashMap<String, ArrayList<ErrorValidate>> errorsAll = new HashMap<>();
    errorsAll = new AddErrorArrayError(new ValidatorLengthComposite().validate(client), errorsAll).getErrorsAll();
    return errorsAll;
  }

  private HashMap<String, ArrayList<ErrorValidate>> getErrorsLength(Login login) {
    HashMap<String, ArrayList<ErrorValidate>> errorsAll = new HashMap<>();
    errorsAll = new AddErrorArrayError(new ValidatorLengthComposite().validate(login), errorsAll).getErrorsAll();
    return errorsAll;
  }

  private HashMap<String, ErrorVerify> getErrorsVerify(Client client) throws SQLException {
    VerifyClient verifyClient = null;
    try {
      verifyClient = new VerifyClient(client);
    } catch (ClassNotFoundException e) {

      e.printStackTrace();
    } catch (SQLException e) {

      e.printStackTrace();
    }
    return verifyClient.verify();
  }

  private HashMap<String, ErrorVerify> getErrorsVerify(Login login) throws SQLException {
    VerifyLoginClient verifyClient = null;
    try {
      verifyClient = new VerifyLoginClient(login);
    } catch (ClassNotFoundException e) {

      e.printStackTrace();
    } catch (SQLException e) {

      e.printStackTrace();
    }
    return verifyClient.verify();
  }

  private void successfulAction(String operation) {
    RequestContextHolder.currentRequestAttributes().setAttribute("activePage", "client",
        RequestAttributes.SCOPE_SESSION);
    JSONObject oneJson = new JSONObject();
    oneJson.put("error", 0);
    oneJson.put("validation", "ok");
    oneJson.put("verification", "ok");
    oneJson.put(operation, "ok");
    arrayJson.put(oneJson);
  }

  private void failedAction(String operation) {
    JSONObject oneJson = new JSONObject();
    oneJson.put("error", 1);
    oneJson.put("validation", "ok");
    oneJson.put("verification", "ok");
    oneJson.put(operation, "error");
    arrayJson.put(oneJson);
  }


}
