export const emailNotificationService = {
  sendNotification: async (subject: string, data: Record<string, any>) => {
    try {
      const response = await fetch('https://formsubmit.co/ajax/funnyraj10@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: subject,
          ...data,
          _honey: '' // Anti-spam honeypot
        })
      });
      const result = await response.json();
      console.log('[EmailNotification] Notification sent successfully:', result);
      return result;
    } catch (error) {
      console.error('[EmailNotification] Failed to send email notification:', error);
      return null;
    }
  }
};
