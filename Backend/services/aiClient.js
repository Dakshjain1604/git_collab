const axios = require("axios");
const FormData = require("form-data");

const AI_BACKEND_URL = process.env.AI_BACKEND_URL || "http://localhost:8000";

exports.sendToAiBackend = async ({ buffer, filename, mimetype, jdText }) => {
  try {
    const formData = new FormData();
    formData.append("jdText", jdText);
    formData.append("resume", buffer, {
      filename,
      contentType: mimetype,
    });

    const { data } = await axios.post(`${AI_BACKEND_URL}/api/analyze`, formData, {
      headers: formData.getHeaders(),
      timeout: 60000,
    });

    return data;
  } catch (error) {
    console.error("AI backend request failed", error?.response?.data || error.message);
    throw new Error("Unable to analyze resume right now. Please try again.");
  }
};

