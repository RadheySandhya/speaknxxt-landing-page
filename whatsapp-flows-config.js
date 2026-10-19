/**
 * WhatsApp Flows API - Developer Integration Guide & Endpoints
 * Reference: https://developers.facebook.com/documentation/business-messaging/whatsapp/flows/guides/flowsapi
 * 
 * Speaknxxt English Learning Platform
 */

const WHATSAPP_FLOW_CONFIG = {
  // Replace with your Meta Business App credentials from developer dashboard
  META_APP_ID: "YOUR_META_APP_ID",
  PHONE_NUMBER_ID: "YOUR_PHONE_NUMBER_ID",
  WABA_ID: "YOUR_WHATSAPP_BUSINESS_ACCOUNT_ID",
  GRAPH_API_VERSION: "v20.0",
  GRAPH_API_BASE_URL: "https://graph.facebook.com",
  
  // Flows Configuration
  FLOW_ID: "YOUR_FLOW_ID", // Created via WhatsApp Flow Builder or API
  FLOW_TOKEN: "FLOW_TOKEN_SPEAKNXXT_DEMO",
  FLOW_MESSAGE_VERSION: "3",
  FLOW_CTA: "Book Free Demo"
};

/**
 * Example function to send a WhatsApp Flow Message to a student via Cloud API
 * @param {string} recipientPhoneNumber - E.164 format (e.g. "919810735296")
 * @param {string} accessToken - System User Access Token with whatsapp_business_messaging permissions
 */
async function sendWhatsAppFlowMessage(recipientPhoneNumber, accessToken) {
  const endpoint = `${WHATSAPP_FLOW_CONFIG.GRAPH_API_BASE_URL}/${WHATSAPP_FLOW_CONFIG.GRAPH_API_VERSION}/${WHATSAPP_FLOW_CONFIG.PHONE_NUMBER_ID}/messages`;

  const payload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: recipientPhoneNumber,
    type: "interactive",
    interactive: {
      type: "flow",
      header: {
        type: "text",
        text: "Speaknxxt English Fluency"
      },
      body: {
        text: "Hi! Welcome to Speaknxxt by Mentor Kunal. Tap below to select your desired course, batch timing, and take your initial English speaking assessment."
      },
      footer: {
        text: "Interactive Learning & Free Demo"
      },
      action: {
        name: "flow",
        parameters: {
          flow_message_version: WHATSAPP_FLOW_CONFIG.FLOW_MESSAGE_VERSION,
          flow_token: WHATSAPP_FLOW_CONFIG.FLOW_TOKEN,
          flow_id: WHATSAPP_FLOW_CONFIG.FLOW_ID,
          flow_cta: WHATSAPP_FLOW_CONFIG.FLOW_CTA,
          flow_action: "navigate",
          flow_action_payload: {
            screen: "COURSE_SELECT",
            data: {
              available_courses: [
                { id: "spoken_foundation", title: "Spoken English Fluency Foundation" },
                { id: "business_comm", title: "Executive Business Communication" },
                { id: "ielts_pte", title: "IELTS 7.5+ & PTE Masterclass" },
                { id: "vip_mentor", title: "1-on-1 VIP Mentorship with Kunal" }
              ]
            }
          }
        }
      }
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error triggering WhatsApp Flow:", error);
    throw error;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { WHATSAPP_FLOW_CONFIG, sendWhatsAppFlowMessage };
}
