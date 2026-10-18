const AllowedEmailProviders = [
  'gmail.com',
  'yahoo.com',
  'outlook.com',
  'hotmail.com',
  'icloud.com'
];

export function isEmailProviderAllowed(email: string): boolean {
  try {
    if (!email || typeof email !== 'string') return false;
    const parts = email.split('@');
    if (parts.length !== 2) return false;
    const domain = parts[1].toLowerCase().trim();
    return AllowedEmailProviders.includes(domain);
  } catch {
    return false;
  }
}

