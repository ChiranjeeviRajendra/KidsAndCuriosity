export function inquiryEmail(data) {
  const subject = `School workshop enquiry — ${data.school.trim()}`
  const body = `Hello Kids & Curiosity,\n\nI'd like to discuss a science workshop.\n\nName: ${data.name.trim()}\nSchool: ${data.school.trim()}\nReply email: ${data.email.trim()}\nInterested in: ${data.workshop}\n\n${data.message.trim()}\n`
  return `mailto:hello@kidsandcuriosity.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
