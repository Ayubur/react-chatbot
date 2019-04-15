module.exports = {
  googleProjectId: process.env.GOOGLE_PROJECTID,
  dialogflowSessionId: process.env.DIALOGFLOW_SESSIONID,
  dialogflowSessionLanguageCode: process.env.DIALOGFLOW_SESSION_LANGUAGE_CODE,
  googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
  googlePrivateKey: JSON.parse(process.env.GOOGLE_PRIVATE_KEY)
};
