
window.InfinityNotifications = {
  bookingConfirmation(b){
    return `Hi ${b.name}, your appointment request at Infinity The Family Salon has been received.

Booking ID: ${b.id}
Service: ${b.service?.[1] || ""}
For: ${b.audience || ""}
Date: ${b.date}
Time: ${b.time}

We will confirm your appointment shortly.
Thank you for choosing Infinity The Family Salon.`;
  },

  ownerAlert(b){
    return `New appointment request — Infinity The Family Salon

Booking ID: ${b.id}
Customer: ${b.name}
Phone: ${b.phone}
Service: ${b.service?.[1] || ""}
For: ${b.audience || ""}
Date: ${b.date}
Time: ${b.time}
Notes: ${b.notes || "None"}

Please review the appointment in the staff dashboard.`;
  },

  statusUpdate(b,status){
    const words={
      confirmed:"Your appointment has been confirmed.",
      cancelled:"Your appointment has been cancelled. Please contact the salon if you need help.",
      completed:"Thank you for visiting Infinity The Family Salon.",
      pending:"Your appointment is still awaiting confirmation."
    };
    return `Hi ${b.name},\n\n${words[status] || ""}\n\nBooking ID: ${b.id}\nService: ${b.service?.[1] || ""}\nDate: ${b.date}\nTime: ${b.time}\n\nInfinity The Family Salon`;
  },

  whatsappUrl(message, phone=""){
    const normalized=String(phone).replace(/\D/g,"");
    return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
  },

  mailto(email,subject,message){
    return `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  }
};
